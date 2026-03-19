const express = require("express");
const router = express.Router();

const { fetchLogs } = require("../controllers/activity.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { isSuperAdmin } = require("../middleware/role.middleware");

router.get("/logs", verifyToken, isSuperAdmin, fetchLogs);

module.exports = router;