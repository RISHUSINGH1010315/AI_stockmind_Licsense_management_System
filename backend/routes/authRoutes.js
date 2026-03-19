const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

//////////////////////////////////////////////////
// REGISTER
//////////////////////////////////////////////////
router.post("/register", async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password required"
      });
    }

    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role",
      [name, email, hashedPassword, role || "employee"]
    );

    res.json({
      message: "User registered",
      user: result.rows[0]
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Register failed" });
  }
});

//////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const result = await pool.query(
      "SELECT id,name,email,password,role FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET || "stockmind_secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });

  } catch (err) {

    console.log("LOGIN ERROR:", err);

    res.status(500).json({
      message: "Login failed",
      error: err.message
    });

  }
});

//////////////////////////////////////////////////
// SUPER ADMIN → LOGIN AS ADMIN
//////////////////////////////////////////////////
router.post("/impersonate/:adminId", async (req, res) => {

  try {

    const { adminId } = req.params;

    const result = await pool.query(
      "SELECT id,name,email,role FROM users WHERE id=$1",
      [adminId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    const admin = result.rows[0];

    const token = jwt.sign(
      {
        id: admin.id,
        role: admin.role
      },
      process.env.JWT_SECRET || "stockmind_secret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Logged in as admin",
      token,
      admin
    });

  } catch (err) {

    console.log("IMPERSONATE ERROR:", err);

    res.status(500).json({
      message: "Impersonation failed"
    });

  }

});

module.exports = router;