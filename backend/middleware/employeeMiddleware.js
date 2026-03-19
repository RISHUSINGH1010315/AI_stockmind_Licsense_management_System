const isEmployee = (req, res, next) => {
  try {
    // token verify ke baad user attach hota hai
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // ⭐ case-safe role check
    const role = String(req.user.role || "").toLowerCase();

    if (role !== "employee") {
      return res.status(403).json({ message: "Employees only access" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Role verification failed" });
  }
};

module.exports = isEmployee;