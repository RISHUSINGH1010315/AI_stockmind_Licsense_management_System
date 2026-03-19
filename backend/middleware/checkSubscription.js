const pool = require("../config/db");

module.exports = async (req, res, next) => {

  try {

    const companyId = req.user.company_id;

    const result = await pool.query(
      "SELECT plan_expiry FROM companies WHERE id=$1",
      [companyId]
    );

    const expiry = result.rows[0]?.plan_expiry;

    if (!expiry) {
      return next();
    }

    if (new Date(expiry) < new Date()) {

      return res.status(403).json({
        message: "Subscription expired. Please renew your plan."
      });

    }

    next();

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Subscription check failed"
    });

  }

};