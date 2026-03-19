const cron = require("node-cron");
const pool = require("../config/db");

// Runs every minute
cron.schedule("* * * * *", async () => {
  try {
    const result = await pool.query(`
      UPDATE licenses
      SET status = 'Expired'
      WHERE expiry_date < NOW() AND status = 'Active'
      RETURNING id
    `);

    if (result.rowCount > 0) {
      console.log(`${result.rowCount} licenses expired automatically`);
    }

  } catch (err) {
    console.log("Cron error:", err.message);
  }
});