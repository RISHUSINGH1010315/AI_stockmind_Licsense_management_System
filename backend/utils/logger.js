const pool = require("../config/db");

exports.saveLog = async (userId, action) => {
  try {
    await pool.query(
      "INSERT INTO activity_logs (user_id, action) VALUES ($1,$2)",
      [userId, action]
    );
  } catch (err) {
    console.log("Log error:", err.message);
  }
};

const { createLog } = require("../models/activityLog.model");

const logActivity = async ({ userId, userRole, action, targetUserId, details }) => {
  try {
    await createLog({ userId, userRole, action, targetUserId, details });
  } catch (err) {
    console.error("Log Error:", err);
  }
};

module.exports = logActivity;