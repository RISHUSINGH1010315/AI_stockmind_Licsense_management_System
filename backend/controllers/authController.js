import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const impersonateAdmin = async (req, res) => {
  try {

    if (req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { adminId } = req.params;

    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [adminId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = result.rows[0];

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Logged in as admin",
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};