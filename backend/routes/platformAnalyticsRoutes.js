const express = require("express");
const router = express.Router();

const { protectUser } = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {
    getPlatformStats,
    getRevenueChart
} = require("../controllers/platformAnalyticsController");

//////////////////////////////////////////////////
// PLATFORM STATS
//////////////////////////////////////////////////

router.get(
    "/platform-stats",
    protectUser,
    authorizeRole("superadmin"),
    getPlatformStats
);

//////////////////////////////////////////////////
// REVENUE CHART
//////////////////////////////////////////////////

router.get(
    "/revenue",
    protectUser,
    authorizeRole("superadmin"),
    getRevenueChart
);

module.exports = router;