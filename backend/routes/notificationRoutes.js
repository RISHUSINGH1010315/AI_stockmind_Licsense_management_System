const express = require("express");
const router = express.Router();

const { protectUser } = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {
  getMyNotifications,
  markNotificationRead
} = require("../controllers/notificationController");

////////////////////////////////////////////////////
// GET NOTIFICATIONS
////////////////////////////////////////////////////

router.get(
  "/",
  protectUser,
  authorizeRole("superadmin"),
  getMyNotifications
);

////////////////////////////////////////////////////
// MARK NOTIFICATION AS READ
////////////////////////////////////////////////////

router.put(
  "/read/:id",
  protectUser,
  authorizeRole("superadmin"),
  markNotificationRead
);

module.exports = router;