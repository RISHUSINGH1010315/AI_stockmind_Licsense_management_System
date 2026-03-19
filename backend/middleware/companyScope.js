module.exports = (req, res, next) => {

  if (req.user.role === "superadmin") {
    return next();
  }

  req.companyId = req.user.company_id;

  next();

};