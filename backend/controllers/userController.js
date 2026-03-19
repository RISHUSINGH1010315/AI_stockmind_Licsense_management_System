const pool = require("../config/db");


// GET all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, role FROM users ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error fetching users");
  }
};

exports.createUser = async (req, res) => {

  try {

    const { name, email, password, company_id } = req.body;

    //////////////////////////////////////////////////
    // GET COMPANY PLAN
    //////////////////////////////////////////////////

    const company = await pool.query(
      "SELECT plan_id FROM companies WHERE id=$1",
      [company_id]
    );

    const planId = company.rows[0].plan_id;

    //////////////////////////////////////////////////
    // GET PLAN LIMIT
    //////////////////////////////////////////////////

    const plan = await pool.query(
      "SELECT users_limit FROM plans WHERE id=$1",
      [planId]
    );

    const limit = plan.rows[0].users_limit;

    //////////////////////////////////////////////////
    // COUNT CURRENT USERS
    //////////////////////////////////////////////////

    const users = await pool.query(
      "SELECT COUNT(*) FROM users WHERE company_id=$1",
      [company_id]
    );

    const currentUsers = parseInt(users.rows[0].count);

    //////////////////////////////////////////////////
    // LIMIT CHECK
    //////////////////////////////////////////////////

    if (currentUsers >= limit) {

      return res.status(400).json({
        message: "Plan user limit reached. Upgrade your plan."
      });

    }

    //////////////////////////////////////////////////
    // CREATE USER
    //////////////////////////////////////////////////

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users(name,email,password,company_id,role) VALUES($1,$2,$3,$4,$5)",
      [name, email, hashedPassword, company_id, "employee"]
    );

    res.json({ message: "User created" });

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Create user failed" });

  }

};

// PROMOTE user → admin
exports.makeAdmin = async (req, res) => {
  try {
    await pool.query(
      "UPDATE users SET role='admin' WHERE id=$1",
      [req.params.id]
    );

    res.json("User promoted to admin 👑");
  } catch (err) {
    res.status(500).json("Error updating role");
  }
};


// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
    res.json("User deleted");
  } catch (err) {
    res.status(500).json("Error deleting user");
  }
};