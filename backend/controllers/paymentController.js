const pool = require("../config/db");
const generateInvoice = require("../utils/generateInvoice");


exports.createMockPayment = async (req, res) => {
  try {
    const { licenseId, amount } = req.body;

    setTimeout(() => {
      res.json({
        success: true,
        paymentId: "PAY_" + Date.now(),
        licenseId,
        amount,
      });
    }, 1500);
  } catch (error) {
    res.status(500).json({ message: "Mock payment failed" });
  }
};

exports.savePayment = async (req, res) => {
  try {
    const { licenseId, amount, paymentId } = req.body;
    const employerId = req.user.id;

    // 1️⃣ Save payment in DB
    await pool.query(
      `INSERT INTO payments 
       (employer_id, license_id, razorpay_payment_id, amount, status)
       VALUES ($1,$2,$3,$4,$5)`,
      [employerId, licenseId, paymentId, amount, "success"]
    );

    // 2️⃣ Mark renewal as paid
    await pool.query(
      `UPDATE renewals 
       SET payment_status = 'paid'
       WHERE license_id = $1 AND status = 'approved'`,
      [licenseId]
    );

    // 3️⃣ Extend license expiry by 1 year
    await pool.query(
      `UPDATE licenses 
       SET expiry_date = expiry_date + INTERVAL '1 year'
       WHERE id = $1`,
      [licenseId]
    );

    // 4️⃣ Generate Invoice PDF ⭐
    const invoicePath = generateInvoice({
      paymentId,
      employerId,
      licenseId,
      amount,
    });

    // 5️⃣ Save invoice path in payments table (important)
    await pool.query(
      `UPDATE payments 
       SET invoice_path = $1 
       WHERE razorpay_payment_id = $2`,
      [invoicePath, paymentId]
    );

    res.json({
      success: true,
      message: "Payment successful, license renewed & invoice generated",
      invoice: invoicePath,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Saving payment failed" });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const employerId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM payments 
       WHERE employer_id = $1 
       ORDER BY created_at DESC`,
      [employerId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};
exports.getAllPayments = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        payments.id,
        users.name AS company,
        licenses.id AS license,
        payments.amount,
        payments.created_at AS payment_date,
        payments.status
      FROM payments
      LEFT JOIN users ON payments.employer_id = users.id
      LEFT JOIN licenses ON payments.license_id = licenses.id
      ORDER BY payments.created_at DESC
    `);

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch payments"
    });

  }
};