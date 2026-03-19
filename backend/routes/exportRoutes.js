const express = require("express");
const router = express.Router();

const { protectAdmin } = require("../middleware/authMiddleware");

const { exportLicenses, exportRenewals } = require("../controllers/exportController");

router.get("/licenses", protectAdmin, exportLicenses);
router.get("/renewals", protectAdmin, exportRenewals);

module.exports = router;