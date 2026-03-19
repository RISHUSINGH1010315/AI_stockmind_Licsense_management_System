const pool = require("../config/db");

exports.getLogs = async (req, res) => {
  try {
    const logs = await pool.query(`
      SELECT activity_logs.*, users.email
      FROM activity_logs
      LEFT JOIN users ON users.id = activity_logs.user_id
      ORDER BY created_at DESC
      LIMIT 50
    `);

    res.json(logs.rows);
  } catch (err) {
    res.status(500).json("Failed to fetch logs");
  }
};