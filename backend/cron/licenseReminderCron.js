const cron = require("node-cron");
const pool = require("../config/db");
const sendEmail = require("../services/emailService");

// ✅ Correct path
const licenseReminderTemplate = require("../emails/licenseReminder.js");

cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Running license reminder cron...");

  try {
    const result = await pool.query(`
      SELECT l.id,
             u.name,
             u.email,
             p.name AS product_name,
             l.expiry_date
      FROM licenses l
      JOIN users u ON l.user_id = u.id
      JOIN products p ON l.product_id = p.id
      WHERE l.expiry_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
      AND l.status = 'Active'
    `);

    for (const row of result.rows) {
      const daysLeft = Math.ceil(
        (new Date(row.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)
      );

      await sendEmail(
        row.email,
        "License Expiry Reminder",
        licenseReminderTemplate(row.name, row.product_name, daysLeft)
      );

      console.log("Reminder sent to:", row.email);
    }

  } catch (err) {
    console.log("Cron error:", err.message);
  }
});