const express = require("express");
const router = express.Router();

const {protectUser} = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {
getAllLicenses
} = require("../controllers/licenseOverviewController");

//////////////////////////////////////////////////

router.get(
"/licenses-overview",
protectUser,
authorizeRole("superadmin"),
getAllLicenses
);

module.exports = router;