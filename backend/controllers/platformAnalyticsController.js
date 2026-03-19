const pool = require("../config/db");

exports.getPlatformStats = async (req, res) => {
    try {

        const users = await pool.query("SELECT COUNT(*) FROM users");
        const admins = await pool.query("SELECT COUNT(*) FROM users WHERE role='admin'");
        const employees = await pool.query("SELECT COUNT(*) FROM users WHERE role='employee'");
        const revenue = await pool.query("SELECT COALESCE(SUM(amount),0) FROM payments");

        res.json({
            totalUsers: users.rows[0].count,
            totalAdmins: admins.rows[0].count,
            totalEmployees: employees.rows[0].count,
            totalRevenue: revenue.rows[0].coalesce
        });

    } catch (error) {
        console.log("Platform stats error:", error);
        res.status(500).json({ message: "Failed to load stats" });
    }
};

exports.getRevenueChart = async (req, res) => {

    try {

        const result = await pool.query(`
      SELECT 
      TO_CHAR(created_at,'Mon') AS month,
      SUM(amount) AS revenue
      FROM payments
      GROUP BY month
      ORDER BY month
    `);

        res.json(result.rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Failed to fetch revenue chart"
        });

    }

};