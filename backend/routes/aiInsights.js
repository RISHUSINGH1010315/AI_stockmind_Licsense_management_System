const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/insights", async (req, res) => {
  try {

    // Low stock products
    const lowStock = await pool.query(
      "SELECT name, stock FROM products WHERE stock < 10"
    );

    // Top selling products
    const topSelling = await pool.query(
      `SELECT p.name, SUM(s.quantity) as total_sold
       FROM sales s
       JOIN products p ON s.product_id = p.id
       GROUP BY p.name
       ORDER BY total_sold DESC
       LIMIT 5`
    );

    // Least selling
    const leastSelling = await pool.query(
      `SELECT p.name, SUM(s.quantity) as total_sold
       FROM sales s
       JOIN products p ON s.product_id = p.id
       GROUP BY p.name
       ORDER BY total_sold ASC
       LIMIT 5`
    );

    res.json({
      lowStock: lowStock.rows,
      topSelling: topSelling.rows,
      leastSelling: leastSelling.rows
    });

  } catch (error) {
    console.log("AI INSIGHTS ERROR:", error.message);
    res.status(500).json({ error: "AI Insights Failed" });
  }
});

module.exports = router;