const express = require("express");
const router = express.Router();

const {protectUser} = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {
getPlans,
createPlan,
deletePlan
} = require("../controllers/planController");

router.get(
"/plans",
protectUser,
authorizeRole("superadmin"),
getPlans
);

router.post(
"/plans",
protectUser,
authorizeRole("superadmin"),
createPlan
);

router.delete(
"/plans/:id",
protectUser,
authorizeRole("superadmin"),
deletePlan
);

router.get(
"/plans",
protectUser,
authorizeRole("superadmin"),
getPlans
);

module.exports = router;