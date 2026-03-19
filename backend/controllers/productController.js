const logActivity = require("../utils/logActivity");

await logActivity(
  "Product Created",
  `Product ${name} added`,
  req.user.id
);