const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analyticsController");

router.get("/dashboard", analyticsController.getDashboardStats);
router.get("/products", analyticsController.getProductInsights);
router.get("/monthly-sales", analyticsController.getMonthlySales);
router.get("/categories", analyticsController.getCategoryPerformance);

module.exports = router;