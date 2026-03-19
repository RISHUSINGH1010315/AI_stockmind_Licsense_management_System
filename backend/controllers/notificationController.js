const pool = require("../config/db");

// GET notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// MARK AS READ ⭐
exports.markNotificationRead = async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query(
      "UPDATE notifications SET is_read=true WHERE id=$1",
      [id]
    );

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};

////////////////////////////////////////////////////
// GET ALL NOTIFICATIONS
////////////////////////////////////////////////////

exports.getNotifications = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT * FROM notifications
       ORDER BY created_at DESC
       LIMIT 20`
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to fetch notifications"
    });

  }
};

////////////////////////////////////////////////////
// MARK AS READ
////////////////////////////////////////////////////

exports.markAsRead = async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE id = $1`,
      [id]
    );

    res.json({ success: true });

  } catch (err) {

    res.status(500).json({
      message: "Failed to update notification"
    });

  }

};