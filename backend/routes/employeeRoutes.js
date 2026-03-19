const express = require("express");
const router = express.Router();

const { protectUser } = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {
  getEmployeeDashboard,
  getMyLicenses,
  getMyRenewals,
  requestRenewal
} = require("../controllers/employeeController");

//////////////////////////////
// 👨‍💼 EMPLOYEE ROUTES
//////////////////////////////

// Dashboard stats (Employee Home)
router.get(
  "/dashboard",
  protectUser,
  authorizeRole("employee"),
  getEmployeeDashboard
);

// My Licenses
router.get(
  "/licenses",
  protectUser,
  authorizeRole("employee"),
  getMyLicenses
);

// My Renewal Requests
router.get(
  "/renewals",
  protectUser,
  authorizeRole("employee"),
  getMyRenewals
);

// Send Renewal Request
router.post(
  "/renewals",
  protectUser,
  authorizeRole("employee"),
  requestRenewal
);

module.exports = router;