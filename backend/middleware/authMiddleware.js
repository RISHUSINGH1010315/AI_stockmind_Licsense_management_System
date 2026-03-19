const jwt = require("jsonwebtoken");
const pool = require("../config/db");

/////////////////////////////////////////////////////
// VERIFY TOKEN FUNCTION
/////////////////////////////////////////////////////
const verifyUserFromToken = async (req) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || "stockmind_secret"
  );

  const result = await pool.query(
    "SELECT id, role, email FROM users WHERE id=$1",
    [decoded.id]
  );

  if (!result.rows.length) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

/////////////////////////////////////////////////////
// PROTECT ANY LOGGED IN USER
/////////////////////////////////////////////////////
const protectUser = async (req, res, next) => {
  try {

    const user = await verifyUserFromToken(req);

    req.user = user;

    next();

  } catch (error) {

    console.error("Auth error:", error.message);

    res.status(401).json({
      message: "Unauthorized"
    });

  }
};

/////////////////////////////////////////////////////
// PROTECT ADMIN
/////////////////////////////////////////////////////
const protectAdmin = async (req, res, next) => {
  try {

    const user = await verifyUserFromToken(req);

    if (user.role.toLowerCase() !== "admin" && user.role.toLowerCase() !== "super_admin") {
      return res.status(403).json({
        message: "Admin access required"
      });
    }

    req.user = user;

    next();

  } catch (err) {

    res.status(401).json({
      message: "Invalid token"
    });

  }
};

/////////////////////////////////////////////////////
// PROTECT MANAGER
/////////////////////////////////////////////////////
const protectManager = async (req, res, next) => {
  try {

    const user = await verifyUserFromToken(req);

    if (
      user.role.toLowerCase() !== "manager" &&
      user.role.toLowerCase() !== "admin" &&
      user.role.toLowerCase() !== "super_admin"
    ) {
      return res.status(403).json({
        message: "Manager access required"
      });
    }

    req.user = user;

    next();

  } catch (err) {

    res.status(401).json({
      message: "Invalid token"
    });

  }
};

/////////////////////////////////////////////////////
// PROTECT EMPLOYEE
/////////////////////////////////////////////////////
const protectEmployee = async (req, res, next) => {
  try {

    const user = await verifyUserFromToken(req);

    if (user.role.toLowerCase() !== "employee") {
      return res.status(403).json({
        message: "Employee access required"
      });
    }

    req.user = user;

    next();

  } catch (err) {

    res.status(401).json({
      message: "Invalid token"
    });

  }
};

module.exports = {
  protectUser,
  protectAdmin,
  protectManager,
  protectEmployee
};