const express = require("express");
const router = express.Router();

const { protectUser, protectAdmin } = require("../middleware/authMiddleware");

const {
  createRenewalRequest,
  getAllRenewals,
  approveRenewal,
  rejectRenewal,
} = require("../controllers/renewalController");

/////////////////////////
// 👨‍💼 EMPLOYEE ROUTES
/////////////////////////

router.post("/", protectUser, createRenewalRequest);

router.get("/my-renewals", protectUser, async (req, res) => {
  try {
    const employeeId = req.user.id;

    const result = await pool.query(
      `SELECT 
          rr.id,
          rr.status,
          rr.created_at,
          l.name AS license_name
       FROM renewal_requests rr
       JOIN licenses l ON rr.license_id = l.id
       WHERE rr.requested_by = $1
       ORDER BY rr.created_at DESC`,
      [employeeId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("MY RENEWALS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/////////////////////////
// 👑 ADMIN ROUTES
/////////////////////////

router.get("/", protectAdmin, getAllRenewals);
router.put("/approve/:id", protectAdmin, approveRenewal);
router.put("/reject/:id", protectAdmin, rejectRenewal);

module.exports = router;