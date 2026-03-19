const express = require("express");
const router = express.Router();
const { protectManager } = require("../middleware/authMiddleware");

router.get("/test", protectManager, (req,res)=>{
  res.json("Manager route working 🚀");
});

module.exports = router;