const pool = require("../config/db");
const bcrypt = require("bcrypt");


//////////////////////////////////////////////////////
// 📊 SYSTEM STATS
//////////////////////////////////////////////////////
exports.getSystemStats = async (req, res) => {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const admins = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role='admin'"
    );
    const employees = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role='employee'"
    );
    const revenue = await pool.query(
      "SELECT COALESCE(SUM(amount),0) FROM payments"
    );

    res.json({
      totalUsers: Number(users.rows[0].count),
      totalAdmins: Number(admins.rows[0].count),
      totalEmployees: Number(employees.rows[0].count),
      totalRevenue: Number(revenue.rows[0].coalesce)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Super admin stats error" });
  }
};

exports.createAdmin = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const checkUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({
        message: "Admin already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await pool.query(
      "INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role",
      [name, email, hashedPassword, "admin"]
    );

    res.status(201).json({
      message: "Admin created successfully",
      admin: newAdmin.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to create admin"
    });

  }
};

//////////////////////////////////////////////////////
// 👑 GET ALL ADMINS
//////////////////////////////////////////////////////
exports.getAllAdmins = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE role='admin'"
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

//////////////////////////////////////////////////////
// 🚫 SUSPEND ADMIN
//////////////////////////////////////////////////////
exports.suspendAdmin = async (req, res) => {

  try {

    const { id } = req.params;

    const admin = await pool.query(
      "SELECT role FROM users WHERE id=$1",
      [id]
    );

    if (admin.rows.length === 0) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    const currentRole = admin.rows[0].role;

    let newRole = currentRole === "admin" ? "suspended" : "admin";

    await pool.query(
      "UPDATE users SET role=$1 WHERE id=$2",
      [newRole, id]
    );

    res.json({
      message: `Admin ${newRole === "suspended" ? "suspended" : "activated"}`
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to update admin status"
    });

  }

};

exports.getAllAdmins = async (req, res) => {
  try {

    const admins = await pool.query(
      "SELECT id,name,email,role FROM users WHERE role='admin'"
    );

    res.json(admins.rows);

  } catch (err) {

    console.error("GET ADMINS ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch admins"
    });

  }
};
//////////////////////////////////////////////////
// AI INSIGHTS
//////////////////////////////////////////////////

exports.getAIInsights = async (req, res) => {
  try {

    const admins = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role='admin'"
    );

    const suspended = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role='suspended'"
    );

    res.json({
      activeAdmins: admins.rows[0].count,
      suspendedAdmins: suspended.rows[0].count
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "AI insights error"
    });
  }
};

//////////////////////////////////////////////////
// DELETE ADMIN
//////////////////////////////////////////////////

exports.deleteAdmin = async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM users WHERE id = $1 AND role = 'admin'",
      [id]
    );

    res.json({
      message: "Admin deleted successfully"
    });

  } catch (error) {

    console.error("DELETE ADMIN ERROR:", error.message);

    res.status(500).json({
      error: "Server error"
    });

  }

};

exports.getRevenueStats = async (req, res) => {

  try {

    const revenue = await pool.query(
      "SELECT SUM(price) AS total_revenue FROM plans"
    );

    const activeCompanies = await pool.query(
      "SELECT COUNT(*) FROM companies WHERE plan_expiry > NOW()"
    );

    const expiredCompanies = await pool.query(
      "SELECT COUNT(*) FROM companies WHERE plan_expiry < NOW()"
    );

    const companies = await pool.query(`
      SELECT companies.name, plans.name AS plan
      FROM companies
      LEFT JOIN plans ON companies.plan_id = plans.id
      LIMIT 5
    `);

    res.json({
      totalRevenue: revenue.rows[0].total_revenue || 0,
      activeCompanies: activeCompanies.rows[0].count,
      expiredCompanies: expiredCompanies.rows[0].count,
      topCompanies: companies.rows
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Revenue stats failed"
    });

  }

};

exports.loginAsUser = async (req,res) => {

try{

const { userId } = req.params;

const user = await pool.query(
"SELECT id,name,email,role FROM users WHERE id=$1",
[userId]
);

if(user.rows.length === 0){
return res.status(404).json({message:"User not found"});
}

const targetUser = user.rows[0];

const token = jwt.sign(
{
id: targetUser.id,
role: targetUser.role,
impersonated: true
},
process.env.JWT_SECRET,
{expiresIn:"2h"}
);

res.json({
token,
user:targetUser
});

}catch(err){

console.log("IMPERSONATION ERROR",err);
res.status(500).json({error:"Server error"});

}

};