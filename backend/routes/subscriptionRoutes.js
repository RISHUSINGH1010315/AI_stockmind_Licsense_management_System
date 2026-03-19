const express = require("express");
const router = express.Router();

const { protectUser } = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const { createSubscription } = require("../controllers/subscriptionController");
const { getAllSubscriptions } = require("../controllers/subscriptionController");



router.post(
    "/create-subscription",
    protectUser,
    authorizeRole("superadmin"),
    createSubscription
);

router.get(
    "/all",
    protectUser,
    authorizeRole("superadmin"),
    getAllSubscriptions
);

module.exports = router;