const pool = require("../config/db");

//////////////////////////////////////////////////
// GET ALL LICENSES (SUPER ADMIN)
//////////////////////////////////////////////////

exports.getAllLicenses = async (req, res) => {

  try {

    const licenses = await pool.query(`
      SELECT 
        l.id,
        u.name AS user_name,
        p.name AS product_name,
        l.end_date,
        l.created_at,
        l.status
      FROM licenses l
      LEFT JOIN users u ON l.user_id = u.id
      LEFT JOIN products p ON l.product_id = p.id
      ORDER BY l.end_date ASC
    `);

    res.json(licenses.rows);

  } catch (err) {

    console.log("LICENSE FETCH ERROR:", err);
    res.status(500).json({ error: "Server error" });

  }

};