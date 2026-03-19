const pool = require("../config/db");

const logActivity = async (action, details, userId = null) => {
  try {
    console.log("LOGGING:", action); // ⭐ DEBUG LINE
    await pool.query(
      "INSERT INTO activity_logs (action, details, user_id) VALUES ($1,$2,$3)",
      [action, details, userId]
    );
  } catch (err) {
    console.log("Activity Log Error:", err.message);
  }
};

module.exports = logActivity;