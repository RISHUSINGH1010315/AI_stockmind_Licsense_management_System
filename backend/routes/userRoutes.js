const express = require("express");
const router = express.Router();

const { protectAdmin } = require("../middleware/authMiddleware");
const checkSubscription = require("../middleware/checkSubscription");

const {
  getAllUsers,
  makeAdmin,
  deleteUser
} = require("../controllers/userController");

//////////////////////////////////////////////////
// 👑 ADMIN → Get all users
//////////////////////////////////////////////////

router.get(
  "/",
  protectAdmin,
  checkSubscription,
  getAllUsers
);

//////////////////////////////////////////////////
// 👑 ADMIN → Promote user to admin
//////////////////////////////////////////////////

router.put(
  "/make-admin/:id",
  protectAdmin,
  checkSubscription,
  makeAdmin
);

//////////////////////////////////////////////////
// 👑 ADMIN → Delete user
//////////////////////////////////////////////////

router.delete(
  "/:id",
  protectAdmin,
  checkSubscription,
  deleteUser
);

module.exports = router;