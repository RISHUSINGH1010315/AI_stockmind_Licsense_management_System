const express = require("express");
const router = express.Router();
const { protectUser } = require("../middleware/authMiddleware");

const {
  stockIn,
  stockOut,
  getInventory,
  getStockInHistory,
  getStockOutHistory
} = require("../controllers/inventoryController");

/* STOCK IN */
router.post("/stock-in", protectUser, stockIn);

/* STOCK OUT */
router.post("/stock-out", protectUser, stockOut);

/* INVENTORY LIST */
router.get("/items", protectUser, getInventory);

/* STOCK IN HISTORY */
router.get("/stock-in-history", protectUser, getStockInHistory);

/* STOCK OUT HISTORY */
router.get("/stock-out-history", protectUser, getStockOutHistory);

module.exports = router;