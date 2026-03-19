const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { protectUser, protectAdmin } = require("../middleware/authMiddleware");
const logActivity = require("../utils/logActivity");

/////////////////////////////////////////////////////
// 💰 RECORD SALE
/////////////////////////////////////////////////////
router.post("/sale", protectUser, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    await pool.query(
      "INSERT INTO sales (product_id, quantity) VALUES ($1,$2)",
      [product_id, quantity]
    );

    await pool.query(
      "UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id=$2",
      [Number(quantity), Number(product_id)]
    );

    res.json({ message: "Sale recorded & stock updated 💰" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to record sale" });
  }
});

/////////////////////////////////////////////////////
// ⚠️ LOW STOCK
/////////////////////////////////////////////////////
router.get("/low-stock", protectUser, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE stock_quantity <= reorder_level ORDER BY stock_quantity ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch low stock products" });
  }
});

/////////////////////////////////////////////////////
// 📊 DASHBOARD ANALYTICS
/////////////////////////////////////////////////////
router.get("/analytics", protectUser, async (req, res) => {
  try {
    const totalProducts = await pool.query("SELECT COUNT(*) FROM products");
    const totalStock = await pool.query("SELECT COALESCE(SUM(stock_quantity),0) FROM products");
    const totalSales = await pool.query("SELECT COALESCE(SUM(quantity),0) FROM sales");
    const revenue = await pool.query(
      `SELECT COALESCE(SUM(s.quantity * p.price),0)
       FROM sales s
       JOIN products p ON s.product_id = p.id`
    );

    res.json({
      total_products: Number(totalProducts.rows[0].count),
      total_stock: Number(totalStock.rows[0].coalesce),
      total_sales: Number(totalSales.rows[0].coalesce),
      total_revenue: Number(revenue.rows[0].coalesce),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

/////////////////////////////////////////////////////
// 📦 ADD PRODUCT (ADMIN)
/////////////////////////////////////////////////////
router.post("/", protectAdmin, async (req, res) => {
  try {
    const { name, category, stock_quantity, reorder_level, price } = req.body;

    const result = await pool.query(
      `INSERT INTO products (name, category, stock_quantity, reorder_level, price)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, category, stock_quantity, reorder_level, price]
    );

    // ⭐ Activity Log
    await logActivity(
      req.user.id,
      "Product Created",
      `Product ${name} added`
    );

    res.json({ message: "Product added successfully 📦", product: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

/////////////////////////////////////////////////////
// 📦 GET ALL PRODUCTS
/////////////////////////////////////////////////////
router.get("/", protectUser, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;