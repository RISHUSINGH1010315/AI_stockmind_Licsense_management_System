const pool = require("../config/db");
const PDFDocument = require("pdfkit");
const predictRenewal = require("../utils/aiRenewalPredictor");
const { Parser } = require("json2csv");
const bcrypt = require("bcrypt");

const sendEmail = require("../services/emailService");
const licenseAssignedTemplate = require("../emails/licenseAssigned");
const renewalApprovedTemplate = require("../emails/renewalApproved");
const renewalRejectedTemplate = require("../emails/renewalRejected");
const createNotification = require("../services/notificationService");

const logActivity = async (userId, action, details = null) => {
  try {
    await pool.query(
      `INSERT INTO activity_logs (action, details, user_id) VALUES ($1,$2,$3)`,
      [action, details, userId]
    );
  } catch (err) {
    console.log(err.message);
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const products = await pool.query("SELECT COUNT(*) FROM products");
    const licenses = await pool.query("SELECT COUNT(*) FROM licenses");
    const pendingRenewals = await pool.query(
      "SELECT COUNT(*) FROM renewal_requests WHERE status='pending'"
    );

    res.json({
      users: users.rows[0].count,
      products: products.rows[0].count,
      licenses: licenses.rows[0].count,
      pendingRenewals: pendingRenewals.rows[0].count,
    });
  } catch {
    res.status(500).json("Stats error");
  }
};

exports.getRevenueStats = async (req, res) => {
  try {

    // TOTAL REVENUE
    const total = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS total FROM payments"
    );

    // CURRENT MONTH REVENUE ⭐ THIS WAS MISSING
    const monthly = await pool.query(`
      SELECT COALESCE(SUM(amount),0) AS month_total
      FROM payments
      WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    `);

    res.json({
      totalRevenue: total.rows[0].total,
      monthlyRevenue: monthly.rows[0].month_total   // ⭐ IMPORTANT
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Revenue error" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id,p.name,p.category,p.total_licenses,
             COUNT(l.id) AS occupied,
             (p.total_licenses - COUNT(l.id)) AS free
      FROM products p
      LEFT JOIN licenses l ON l.product_id = p.id
      GROUP BY p.id
      ORDER BY p.id DESC
    `);
    res.json(result.rows);
  } catch {
    res.status(500).json("Products error");
  }
};

exports.assignLicense = async (req, res) => {
  try {
    const { employeeId, productId } = req.body;
    const adminId = req.user.id;

    await pool.query(
      `INSERT INTO assigned_licenses 
   (employee_id, product_id, assigned_by)
   VALUES ($1, $2, $3)`,
      [employeeId, productId, adminId]
    );

    res.status(201).json({ message: "License assigned successfully" });

  } catch (error) {
    console.error("ASSIGN LICENSE ERROR:", error.message);
    res.status(500).json({ message: "Failed to assign license" });
  }
};

exports.getAllLicenses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.id,u.name AS employee_name,p.name AS product_name,
             l.expiry_date,l.status
      FROM licenses l
      JOIN users u ON l.user_id = u.id
      JOIN products p ON l.product_id = p.id
      ORDER BY l.id DESC
    `);
    res.json(result.rows);
  } catch {
    res.status(500).json("Licenses fetch error");
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id,r.price,r.paid_at,u.name AS employee_name,p.name AS product_name
      FROM renewal_requests r
      JOIN users u ON r.requested_by=u.id
      JOIN licenses l ON r.license_id=l.id
      JOIN products p ON l.product_id=p.id
      WHERE r.payment_status='paid'
      ORDER BY r.paid_at DESC
    `);
    res.json(result.rows);
  } catch {
    res.status(500).json("Payments error");
  }
};

exports.getActivityLogs = async (req, res) => {
  const logs = await pool.query(`
    SELECT a.id,a.action,a.details,a.created_at,u.name AS admin
    FROM activity_logs a
    LEFT JOIN users u ON u.id=a.user_id
    ORDER BY a.created_at DESC
  `);
  res.json(logs.rows);
};

exports.getRenewalPredictions = async (req, res) => {
  try {
    const data = await pool.query(`
      SELECT l.id,u.name AS employee_name,p.name AS product_name,l.expiry_date,
             COUNT(r.id) AS renewal_count,
             SUM(CASE WHEN r.payment_status='paid' THEN 1 ELSE 0 END) AS paid_count
      FROM licenses l
      LEFT JOIN renewal_requests r ON r.license_id=l.id
      JOIN users u ON l.user_id=u.id
      JOIN products p ON l.product_id=p.id
      GROUP BY l.id,u.name,p.name
    `);

    const predictions = data.rows.map(row => {
      const daysLeft = Math.ceil((new Date(row.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
      const ai = predictRenewal(daysLeft, Number(row.renewal_count), Number(row.paid_count));
      return { ...row, daysLeft, ...ai };
    });

    res.json(predictions);
  } catch {
    res.status(500).json("AI error");
  }
};

// ⭐ GET ALL RENEWAL REQUESTS (ADMIN TABLE DATA)
exports.getAllRenewals = async (req, res) => {
  console.log("🔥 ADMIN RENEWALS API HIT");

  try {
    const result = await pool.query(`
      SELECT 
        r.id,
        r.status,
        r.created_at,
        r.renewal_date,
        u.name AS employee_name,
        p.name AS product_name
      FROM renewals r
      LEFT JOIN users u ON u.id = r.employee_id
      LEFT JOIN products p ON p.id = r.product_id
      ORDER BY r.created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.log("❌ ADMIN RENEWALS ERROR FULL:", err);
    res.status(500).json({ message: "Failed to fetch renewals" });
  }
};

// ✅ APPROVE RENEWAL
// ✅ APPROVE RENEWAL (FINAL FIX)
exports.approveRenewal = async (req, res) => {
  try {
    const { id } = req.params;

    // Only update renewals table (no employee_id, no license_id)
    await pool.query(
      "UPDATE renewals SET status='Approved', renewal_date=NOW() WHERE id=$1",
      [id]
    );

    res.json({ message: "Renewal approved successfully" });

  } catch (err) {
    console.log("APPROVE ERROR:", err.message);
    res.status(500).json({ message: "Approval failed" });
  }
};

exports.rejectRenewal = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE renewals SET status='Rejected' WHERE id=$1",
      [id]
    );

    res.json({ message: "Renewal rejected successfully" });
  } catch (err) {
    console.log("REJECT ERROR:", err.message);
    res.status(500).json({ message: "Reject failed" });
  }
};

exports.exportLicensesCSV = async (req, res) => {
  try {
    const data = await pool.query(`
      SELECT u.name AS employee,p.name AS product,l.expiry_date,l.status
      FROM licenses l
      JOIN users u ON l.user_id=u.id
      JOIN products p ON l.product_id=p.id
      ORDER BY l.id DESC
    `);

    const csv = new Parser().parse(data.rows);
    res.header("Content-Type", "text/csv");
    res.attachment("licenses-report.csv");
    res.send(csv);
  } catch {
    res.status(500).json("CSV export failed");
  }
};

exports.exportPaymentsPDF = async (req, res) => {
  const result = await pool.query(`
    SELECT r.price,r.paid_at,u.name AS employee,p.name AS product
    FROM renewal_requests r
    JOIN users u ON r.requested_by=u.id
    JOIN licenses l ON r.license_id=l.id
    JOIN products p ON l.product_id=p.id
    WHERE r.payment_status='paid'
  `);

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=payments.pdf");
  doc.pipe(res);

  doc.fontSize(20).text("Payments Report");
  result.rows.forEach(row => doc.text(`${row.employee} - ${row.product} - ₹${row.price}`));
  doc.end();
};

exports.generateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT r.id,r.price,r.paid_at,u.name AS employee_name,u.email,p.name AS product_name
      FROM renewal_requests r
      JOIN users u ON r.requested_by=u.id
      JOIN licenses l ON r.license_id=l.id
      JOIN products p ON l.product_id=p.id
      WHERE r.id=$1
    `, [id]);

    const invoice = result.rows[0];

    await sendEmail(
      invoice.email,
      "Payment Successful - Invoice Generated",
      `<h2>Payment Successful</h2>
       <p>Hello ${invoice.employee_name}, your payment for <b>${invoice.product_name}</b> is successful.</p>`
    );

    const userResult = await pool.query(
      "SELECT requested_by FROM renewal_requests WHERE id=$1",
      [id]
    );

    await createNotification(
      userResult.rows[0].requested_by,
      "Payment Successful",
      `Payment completed for ${invoice.product_name}`
    );

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${id}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text("StockMind Invoice");
    doc.text(`Employee: ${invoice.employee_name}`);
    doc.text(`Product: ${invoice.product_name}`);
    doc.text(`Amount Paid: ₹${invoice.price}`);
    doc.end();
  } catch {
    res.status(500).json("Invoice generation failed");
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE role='EMPLOYEE' ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json("Employees fetch error");
  }
};

// GET ALL EMPLOYEES FOR ASSIGN LICENSE
exports.getEmployees = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE role='employee'"
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json("Failed to fetch employees");
  }
};

//////////////////////////////////////////////////////
// 👨‍💼 CREATE EMPLOYEE
//////////////////////////////////////////////////////
exports.createEmployee = async (req, res) => {
  try {

    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const checkUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({
        message: "Employee already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await pool.query(
      "INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role",
      [name, email, hashedPassword, "employee"]
    );

    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee.rows[0]
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create employee"
    });
  }
};