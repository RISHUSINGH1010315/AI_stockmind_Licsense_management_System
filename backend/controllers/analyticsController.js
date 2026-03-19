const pool = require("../config/db");

/* ================= DASHBOARD STATS ================= */
exports.getDashboardStats = async (req, res) => {
  try {

    // Total products (inventory rows)
    const totalProducts = await pool.query(
      "SELECT COUNT(*) FROM inventory"
    );

    // Low stock
    const lowStock = await pool.query(
      "SELECT item_name, available_qty FROM inventory WHERE available_qty < 10"
    );

    // Revenue (using correct column: total_amount)
    const revenue = await pool.query(
      "SELECT COALESCE(SUM(total_amount),0) AS revenue FROM stock_out"
    );

    res.json({
      totalProducts: Number(totalProducts.rows[0].count),
      stockValue: 0, // You don’t store price in inventory
      lowStockProducts: lowStock.rows,
      totalRevenue: Number(revenue.rows[0].revenue)
    });

  } catch (err) {
    console.error("🔥 DASHBOARD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= FAST & SLOW PRODUCTS ================= */
exports.getProductInsights = async (req, res) => {
  try {

    // Fast moving products (highest qty sold)
    const fastMoving = await pool.query(`
      SELECT item_id, SUM(qty) AS total_sold
      FROM stock_out
      GROUP BY item_id
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    // Slow moving products (lowest qty sold)
    const slowMoving = await pool.query(`
      SELECT item_id, SUM(qty) AS total_sold
      FROM stock_out
      GROUP BY item_id
      ORDER BY total_sold ASC
      LIMIT 5
    `);

    res.json({
      fastMoving: fastMoving.rows,
      slowMoving: slowMoving.rows
    });

  } catch (err) {
    console.error("🔥 PRODUCT INSIGHTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= MONTHLY SALES ================= */
exports.getMonthlySales = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(sale_date, 'Mon') AS month,
        SUM(quantity) AS total_sales
      FROM sales
      GROUP BY TO_CHAR(sale_date, 'Mon')
      ORDER BY MIN(sale_date)
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Monthly Sales Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= CATEGORY PERFORMANCE ================= */
exports.getCategoryPerformance = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.category,
        SUM(s.quantity) AS total_sold
      FROM sales s
      JOIN products p ON s.product_id = p.id
      GROUP BY p.category
      ORDER BY total_sold DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Category Performance Error:", error);
    res.status(500).json({ error: error.message });
  }
};
