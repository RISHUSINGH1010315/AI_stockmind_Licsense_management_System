const pool = require("../config/db");

//////////////////////////////////////////////////////
// 📊 EMPLOYEE DASHBOARD STATS (FIXED)
//////////////////////////////////////////////////////
exports.getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Total Assigned Licenses
    const licenses = await pool.query(
      "SELECT COUNT(*) FROM assigned_licenses WHERE employee_id=$1",
      [userId]
    );

    // 2️⃣ Pending Renewals
    const renewals = await pool.query(
      "SELECT COUNT(*) FROM renewals WHERE employee_id=$1 AND status='PENDING'",
      [userId]
    );

    // 3️⃣ Unread Notifications
    const notifications = await pool.query(
      "SELECT COUNT(*) FROM notifications WHERE user_id=$1 AND is_read=false",
      [userId]
    );

    res.json({
      licenses: Number(licenses.rows[0].count),
      pendingRenewals: Number(renewals.rows[0].count),
      notifications: Number(notifications.rows[0].count)
    });

  } catch (err) {
    console.error("Employee dashboard error:", err.message);
    res.status(500).json({ message: "Employee dashboard error" });
  }
};

//////////////////////////////////////////////////////
// 📄 GET MY LICENSES
//////////////////////////////////////////////////////
exports.getMyLicenses = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const result = await pool.query(
      `SELECT 
          al.id,
          al.product_id,
          p.name,
          COALESCE(al.status, 'active') AS status,
          al.assigned_at
       FROM assigned_licenses al
       JOIN products p ON al.product_id = p.id
       WHERE al.employee_id = $1
       ORDER BY al.assigned_at DESC`,
      [employeeId]
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("GET MY LICENSES ERROR:", error.message);
    res.status(500).json({
      message: "Failed to fetch licenses",
      error: error.message
    });
  }
};

//////////////////////////////////////////////////////
// 🔄 GET MY RENEWALS
//////////////////////////////////////////////////////
exports.getMyRenewals = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT 
        r.id,
        r.status,
        r.current_expiry,
        r.requested_date,
        r.created_at,
        r.renewal_date,
        p.name AS product_name
      FROM renewals r
      JOIN products p ON r.product_id = p.id
      WHERE r.employee_id = $1
      ORDER BY r.created_at DESC
    `, [userId]);

    res.json(result.rows);

  } catch (err) {
    console.error("GET MY RENEWALS ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch renewals" });
  }
};

//////////////////////////////////////////////////////
// 📩 SEND RENEWAL REQUEST (FIXED)
//////////////////////////////////////////////////////
exports.requestRenewal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    // 🔍 Check if already pending request exists
    const existing = await pool.query(
      `SELECT * FROM renewals 
       WHERE employee_id=$1 AND product_id=$2 AND status='PENDING'`,
      [userId, product_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "Renewal request already pending"
      });
    }

    // ✅ Insert renewal request
    await pool.query(
      `INSERT INTO renewals (employee_id, product_id, status, requested_date)
       VALUES ($1,$2,'PENDING',NOW())`,
      [userId, product_id]
    );

    res.json({ message: "Renewal request sent successfully" });

  } catch (err) {
    console.log("Renewal request error:", err.message);
    res.status(500).json({ message: "Failed to request renewal" });
  }
};