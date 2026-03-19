const express = require("express");
const router = express.Router();
const pool = require("../config/db");

//////////////////////////////////////////////////
// GET ALL ADMINS
//////////////////////////////////////////////////

router.get("/admins", async (req, res) => {
  try {

    const admins = await pool.query(
      "SELECT id,name,email FROM users WHERE role='admin' ORDER BY id DESC"
    );

    res.json(admins.rows);

  } catch (error) {
    console.log("GET ADMINS ERROR:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

//////////////////////////////////////////////////
// CREATE ADMIN
//////////////////////////////////////////////////

router.post("/admins", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const newAdmin = await pool.query(
      "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,'admin') RETURNING *",
      [name,email,password]
    );

    res.json(newAdmin.rows[0]);

  } catch (error) {
    console.log("CREATE ADMIN ERROR:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

//////////////////////////////////////////////////
// DELETE ADMIN
//////////////////////////////////////////////////

router.delete("/admins/:id", async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM users WHERE id=$1",
      [id]
    );

    res.json({ message:"Admin deleted" });

  } catch (error) {
    console.log("DELETE ADMIN ERROR:", error.message);
    res.status(500).json({ error:"Server error" });
  }
});

module.exports = router;