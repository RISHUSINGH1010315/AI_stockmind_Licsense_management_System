const pool = require("../config/db");
const { getRenewalRecommendation } = require("../services/aiService");

//////////////////////////////////////////////////
// 👨‍💼 EMPLOYEE → CREATE REQUEST
//////////////////////////////////////////////////

exports.createRenewalRequest = async (req, res) => {
  try {
    const { license_id } = req.body;

    await pool.query(
      `INSERT INTO renewal_requests
   (license_id, requested_by, duration, status, created_at, price, payment_status)
   VALUES ($1,$2,$3,'Pending',NOW(),$4,'unpaid')`,
      [license_id, req.user.id, 12, 1000]
    );

    res.json({ message: "Renewal request created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

//////////////////////////////////////////////////
// 👑 ADMIN → GET ALL REQUESTS
//////////////////////////////////////////////////

exports.getAllRenewals = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id,
        r.status,
        r.duration,
        r.created_at,
        r.price,
        r.payment_status,

        u.name AS employee_name,
        l.name AS license_name,
        l.expiry_date AS current_expiry

      FROM renewal_requests r
      JOIN users u ON r.requested_by = u.id
      JOIN licenses l ON r.license_id = l.id

      ORDER BY r.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.log("GET RENEWALS ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

//////////////////////////////////////////////////
// APPROVE
//////////////////////////////////////////////////

exports.approveRenewal = async (req, res) => {
  try {
    const { id } = req.params;

    const renewal = await pool.query(
      "SELECT product_id FROM renewals WHERE id=$1",
      [id]
    );

    const licenseId = renewal.rows[0].license_id;

    await pool.query(
      `UPDATE licenses 
       SET expiry_date = expiry_date + INTERVAL '1 year'
       WHERE product_id=$1`,
      [licenseId]
    );

    await pool.query(
      "UPDATE renewals SET status='Approved' WHERE id=$1",
      [id]
    );

    res.json({ message: "Renewal approved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

//////////////////////////////////////////////////
// REJECT
//////////////////////////////////////////////////

exports.rejectRenewal = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE renewals SET status='Rejected' WHERE id=$1",
      [id]
    );

    res.json({ message: "Renewal rejected" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};