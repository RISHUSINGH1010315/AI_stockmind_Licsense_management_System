const express = require("express");
const router = express.Router();

const { protectUser } = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");


const {
  getCompanies,
  createCompany,
  getCompanyDetails,
  deleteCompany,
  assignPlan
} = require("../controllers/companyController");

//////////////////////////////////////////////////

router.get(
  "/companies",
  protectUser,
  authorizeRole("superadmin"),
  getCompanies
);

router.post(
  "/companies",
  protectUser,
  authorizeRole("superadmin"),
  createCompany
);

router.get(
  "/company/:id",
  protectUser,
  authorizeRole("superadmin"),
  getCompanyDetails
);

router.delete(
  "/companies/:id",
  protectUser,
  authorizeRole("superadmin"),
  deleteCompany
);

router.post(
"/assign-plan",
protectUser,
authorizeRole("superadmin"),
assignPlan
);

module.exports = router;