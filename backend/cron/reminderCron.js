const cron = require("node-cron");
const pool = require("../config/db");
const { sendEmail } = require("../utils/mailer");

// runs every day at 9 AM
cron.schedule("* * * * *", async () => {
  console.log("⏰ Running License Expiry Reminder...");

  try {
    // find licenses expiring in next 3 days
    const licenses = await pool.query(`
      SELECT l.*, u.email 
      FROM licenses l
      JOIN users u ON u.id = l.user_id
      WHERE l.end_time BETWEEN NOW() AND NOW() + INTERVAL '3 days'
    `);

    for (let lic of licenses.rows) {
      await sendEmail(
        lic.email,
        "License Expiring Soon ⚠️",
        `
          <h2>Your license is expiring soon!</h2>
          <p>Your license will expire on:</p>
          <h3>${new Date(lic.end_time).toDateString()}</h3>
          <br/>
          <p>Please renew your license to avoid interruption.</p>
          <p>— StockMind AI</p>
        `
      );

      console.log("Reminder email sent to", lic.email);
    }

    console.log("✅ Expiry check complete");
  } catch (err) {
    console.log("❌ Cron Error:", err);
  }
});