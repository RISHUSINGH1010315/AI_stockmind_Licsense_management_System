const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { protectAdmin } = require("../middleware/authMiddleware");

router.get("/", protectAdmin, async (req, res) => {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const products = await pool.query("SELECT COUNT(*) FROM products");
    const licenses = await pool.query("SELECT COUNT(*) FROM licenses");
    const pendingRenewals = await pool.query(
      "SELECT COUNT(*) FROM renewals WHERE status='Pending'"
    );

    res.json({
      users: Number(users.rows[0].count),
      products: Number(products.rows[0].count),
      licenses: Number(licenses.rows[0].count),
      pendingRenewals: Number(pendingRenewals.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;