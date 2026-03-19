const pool = require("../config/db");
const { sendRealtimeNotification } = require("../socket");

const createNotification = async (userId, title, message) => {
  try {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, title, message)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [userId, title, message]
    );

    const notification = result.rows[0];

    // 🔴 REALTIME PUSH
    sendRealtimeNotification(userId, notification);

  } catch (err) {
    console.log("Notification error:", err.message);
  }
};

module.exports = createNotification;