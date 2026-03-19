const express = require("express");
const router = express.Router();

const {protectUser} = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {getLogs} = require("../controllers/systemLogController");

//////////////////////////////////////////////////

router.get(
"/logs",
protectUser,
authorizeRole("superadmin"),
getLogs
);

module.exports = router;