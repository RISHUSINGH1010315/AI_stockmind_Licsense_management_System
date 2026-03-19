const express = require("express");
const router = express.Router();

const { protectUser } = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {
  getSystemStats,
  getAllAdmins,
  suspendAdmin,
  createAdmin,
  deleteAdmin,
  getAIInsights,
  getRevenueStats
} = require("../controllers/superAdminController");

//////////////////////////////////////////////////
// DASHBOARD STATS
//////////////////////////////////////////////////
router.get(
  "/stats",
  protectUser,
  authorizeRole("superadmin"),
  getSystemStats
);

//////////////////////////////////////////////////
// CREATE ADMIN
//////////////////////////////////////////////////
router.post(
  "/admins",
  protectUser,
  authorizeRole("superadmin"),
  createAdmin
);

//////////////////////////////////////////////////
// GET ALL ADMINS
//////////////////////////////////////////////////
router.get(
  "/admins",
  protectUser,
  authorizeRole("superadmin"),
  getAllAdmins
);

//////////////////////////////////////////////////
// SUSPEND / ACTIVATE ADMIN
//////////////////////////////////////////////////
router.put(
  "/admins/:id/suspend",
  protectUser,
  authorizeRole("superadmin"),
  suspendAdmin
);

//////////////////////////////////////////////////
// DELETE ADMIN
//////////////////////////////////////////////////
router.delete(
  "/admins/:id",
  protectUser,
  authorizeRole("superadmin"),
  deleteAdmin
);

//////////////////////////////////////////////////
// AI INSIGHTS
//////////////////////////////////////////////////
router.get(
  "/ai-insights",
  protectUser,
  authorizeRole("superadmin"),
  getAIInsights
);

router.get(
"/revenue-stats",
protectUser,
authorizeRole("superadmin"),
getRevenueStats
);
module.exports = router;