const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/authMiddleware");

const {
  getAdminStats,
  getEmployees,
  getProducts,
  getAllLicenses,
  assignLicense,
  getAllRenewals,
  approveRenewal,
  rejectRenewal,
  getRevenueStats,
  getAllPayments,
  generateInvoice,
  getActivityLogs,
  getRenewalPredictions,
  exportLicensesCSV,
  exportPaymentsPDF,
  createEmployee
} = require("../controllers/adminController");

//////////////////////////////
// 📊 DASHBOARD
//////////////////////////////
router.get("/stats", protectAdmin, getAdminStats);
router.get("/revenue", protectAdmin, getRevenueStats);

//////////////////////////////
// 👥 EMPLOYEES
//////////////////////////////

// Create Employee
router.post("/create-employee", protectAdmin, createEmployee);

// Get Employees
router.get("/employees", protectAdmin, getEmployees);

//////////////////////////////
// 📦 PRODUCTS
//////////////////////////////
router.get("/products", protectAdmin, getProducts);

//////////////////////////////
// 🔑 LICENSE MANAGEMENT
//////////////////////////////
router.post("/assign-license", protectAdmin, assignLicense);
router.get("/licenses", protectAdmin, getAllLicenses);

//////////////////////////////
// 💳 PAYMENTS
//////////////////////////////
router.get("/payments", protectAdmin, getAllPayments);
router.get("/invoice/:id", protectAdmin, generateInvoice);

//////////////////////////////
// 🔄 RENEWALS
//////////////////////////////
router.get("/renewals", protectAdmin, getAllRenewals);
router.put("/renewals/approve/:id", protectAdmin, approveRenewal);
router.put("/renewals/reject/:id", protectAdmin, rejectRenewal);

//////////////////////////////
// 📜 ACTIVITY LOGS
//////////////////////////////
router.get("/logs", protectAdmin, getActivityLogs);

//////////////////////////////
// 🤖 AI PREDICTIONS
//////////////////////////////
router.get("/ai-predictions", protectAdmin, getRenewalPredictions);

//////////////////////////////
// 📤 EXPORTS
//////////////////////////////
router.get("/export/licenses", protectAdmin, exportLicensesCSV);
router.get("/export/payments", protectAdmin, exportPaymentsPDF);

module.exports = router;