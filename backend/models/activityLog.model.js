const pool = require("../config/db");

// Create Activity Log
const createLog = async ({ userId, userRole, action, targetUserId, details }) => {
  const query = `
    INSERT INTO activity_logs (user_id, user_role, action, target_user_id, details)
    VALUES ($1, $2, $3, $4, $5)
  `;

  await pool.query(query, [userId, userRole, action, targetUserId, details]);
};

// Get All Logs
const getAllLogs = async () => {
  const result = await pool.query(`
    SELECT * FROM activity_logs ORDER BY created_at DESC
  `);
  return result.rows;
};

module.exports = {
  createLog,
  getAllLogs
};