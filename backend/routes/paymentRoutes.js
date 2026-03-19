const express = require("express");
const router = express.Router();

const { protectUser } = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {
  createMockPayment,
  savePayment,
  getMyPayments,
  getAllPayments
} = require("../controllers/paymentController");

//////////////////////////////////////////////////
// MOCK PAYMENT
//////////////////////////////////////////////////

router.post(
  "/mock",
  protectUser,
  createMockPayment
);

//////////////////////////////////////////////////
// SAVE PAYMENT
//////////////////////////////////////////////////

router.post(
  "/save",
  protectUser,
  savePayment
);

//////////////////////////////////////////////////
// EMPLOYER → GET MY PAYMENTS
//////////////////////////////////////////////////

router.get(
  "/my",
  protectUser,
  getMyPayments
);

//////////////////////////////////////////////////
// SUPER ADMIN → GET ALL PAYMENTS
//////////////////////////////////////////////////

router.get(
  "/all",
  protectUser,
  authorizeRole("superadmin"),
  getAllPayments
);

module.exports = router;