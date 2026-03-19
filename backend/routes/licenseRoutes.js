const express = require("express");
const router = express.Router();

const {
  bookLicense,
  getAllLicenses,
  checkExpiredLicenses,
  getMyLicenses
} = require("../controllers/licenseController");

const { protectUser, protectAdmin } = require("../middleware/authMiddleware");
const companyScope = require("../middleware/companyScope");

////////////////////////////////////////////////////
// USER ROUTES
////////////////////////////////////////////////////

router.get("/my", protectUser, getMyLicenses);

router.post("/book", protectUser, bookLicense);

////////////////////////////////////////////////////
// ADMIN ROUTES
////////////////////////////////////////////////////

router.get(
  "/",
  protectAdmin,
  companyScope,
  getAllLicenses
);

////////////////////////////////////////////////////
// SYSTEM ROUTE (NO AUTH)
////////////////////////////////////////////////////

router.get("/check-expired", checkExpiredLicenses);

module.exports = router;