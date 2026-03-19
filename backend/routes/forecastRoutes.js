const express = require("express");
const router = express.Router();

const { protectUser } = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {
  getForecast,
  getLowStockAlerts,
  getAnalyticsSummary,
  getForecastTrend,
  getAutoReorder,
  getAIInsights
} = require("../controllers/forecastController");

//////////////////////////////////////////////////
// LOW STOCK ALERTS (AI)
//////////////////////////////////////////////////
router.get(
  "/alerts/low-stock",
  protectUser,
  authorizeRole("admin", "superadmin"),
  getLowStockAlerts
);

//////////////////////////////////////////////////
// ANALYTICS SUMMARY
//////////////////////////////////////////////////
router.get(
  "/analytics/summary",
  protectUser,
  authorizeRole("admin", "superadmin"),
  getAnalyticsSummary
);

//////////////////////////////////////////////////
// FORECAST TREND FOR PRODUCT
//////////////////////////////////////////////////
router.get(
  "/analytics/trend/:productId",
  protectUser,
  authorizeRole("admin", "superadmin"),
  getForecastTrend
);

//////////////////////////////////////////////////
// DEMAND FORECAST FOR PRODUCT
//////////////////////////////////////////////////
router.get(
  "/:productId",
  protectUser,
  authorizeRole("admin", "superadmin"),
  getForecast
);


router.get(
  "/ai/reorder",
  protectUser,
  authorizeRole("admin", "superadmin"),
  getAutoReorder
);

router.get(
  "/ai/insights",
  protectUser,
  authorizeRole("admin", "superadmin"),
  getAIInsights
);

module.exports = router;