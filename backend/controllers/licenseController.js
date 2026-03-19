const pool = require("../config/db");
const generateLicenseKey = require("../utils/generateLicenseKey");
const logActivity = require("../utils/logActivity");

/////////////////////////////////////////////////////
// 👤 GET MY LICENSES (EMPLOYEE)
/////////////////////////////////////////////////////
exports.getMyLicenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        l.id,
        l.license_key,
        l.start_date,
        l.end_date,
        l.status,
        p.name AS product_name
      FROM licenses l
      LEFT JOIN products p ON l.product_id = p.id
      WHERE l.assigned_to = $1
      ORDER BY l.id DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/////////////////////////////////////////////////////
// 🔵 BOOK / ASSIGN LICENSE (ADMIN)
/////////////////////////////////////////////////////
exports.bookLicense = async (req, res) => {
  try {
    const { productId, userId, durationHours } = req.body;

    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + durationHours * 60 * 60 * 1000
    );

    const licenseKey = generateLicenseKey();

    // Insert license
    const result = await pool.query(
      `
      INSERT INTO licenses
      (product_id, assigned_to, license_key, start_date, end_date, status)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *;
      `,
      [productId, userId, licenseKey, startDate, endDate, "Active"]
    );

    // Fetch names for better log message
    const product = await pool.query(
      "SELECT name FROM products WHERE id=$1",
      [productId]
    );

    const user = await pool.query(
      "SELECT name FROM users WHERE id=$1",
      [userId]
    );

    // 🔥 ACTIVITY LOG
    await logActivity(
      "License Assigned",
      `License for ${product.rows[0].name} assigned to ${user.rows[0].name}`,
      req.user.id
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/////////////////////////////////////////////////////
// 🟢 GET ALL LICENSES (ADMIN)
/////////////////////////////////////////////////////
exports.getAllLicenses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.id,
        l.license_key,
        l.start_date,
        l.end_date,
        l.status,
        u.name AS employee_name,
        p.name AS product_name
      FROM licenses l
      LEFT JOIN users u ON l.assigned_to = u.id
      LEFT JOIN products p ON l.product_id = p.id
      ORDER BY l.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/////////////////////////////////////////////////////
// 🔥 AUTO EXPIRE LICENSES (SYSTEM ACTION)
/////////////////////////////////////////////////////
exports.checkExpiredLicenses = async (req, res) => {

  try {

    const result = await pool.query(`
      UPDATE licenses
      SET status = 'Expired'
      WHERE end_date < NOW()
      AND status = 'Active'
      RETURNING *
    `);

    res.json({
      message: "Expired licenses updated",
      licenses: result.rows
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to check expired licenses"
    });

  }

};