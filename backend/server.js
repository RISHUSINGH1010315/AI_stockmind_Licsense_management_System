const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");

const pool = require("./config/db");
const { initSocket } = require("./socket");
const { protectAdmin } = require("./middleware/authMiddleware");

/* ================= START CRON ================= */
require("./cron/licenseReminderCron");
require("./cron/subscriptionExpiryCron");

/* ================= APP INIT ================= */
const app = express();

/* ================= CORS ================= */
app.use(cors());

/* ================= BODY PARSER ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES IMPORT ================= */
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const licenseRoutes = require("./routes/licenseRoutes");
const renewalRoutes = require("./routes/renewalRoutes");
const adminRoutes = require("./routes/adminRoutes");
const exportRoutes = require("./routes/exportRoutes");
const logRoutes = require("./routes/logRoutes");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const managerRoutes = require("./routes/managerRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const forecastRoutes = require("./routes/forecastRoutes");

/* SUPER ADMIN MODULE */
const superAdminRoutes = require("./routes/superAdminRoutes");
const superAdminAdmins = require("./routes/superAdminAdmins");
const companyRoutes = require("./routes/companyRoutes");
const licenseOverviewRoutes = require("./routes/licenseOverviewRoutes");
const systemLogRoutes = require("./routes/systemLogRoutes");
const aiInsights = require("./routes/aiInsights");
const platformAnalyticsRoutes = require("./routes/platformAnalyticsRoutes");
const planRoutes = require("./routes/planRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");




/* ================= API ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/licenses", licenseRoutes);
app.use("/api/renewals", renewalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/forecast", forecastRoutes);

/* ================= SUPER ADMIN ROUTES ================= */

app.use("/api/super-admin", superAdminRoutes);
app.use("/api/super-admin", superAdminAdmins);
app.use("/api/super-admin", companyRoutes);
app.use("/api/super-admin", licenseOverviewRoutes);
app.use("/api/super-admin", systemLogRoutes);
app.use("/api/super-admin", platformAnalyticsRoutes);
app.use("/api/super-admin", planRoutes);

app.use("/api/subscription", subscriptionRoutes);

/* AI INSIGHTS */
app.use("/api/ai", aiInsights);

/* ================= STATIC FILES ================= */
app.use("/invoices", express.static("invoices"));

/* ================= ROOT ROUTE ================= */
app.get("/", (req, res) => {
  res.send("StockMind Backend Running 🚀");
});

/* ================= ADMIN TEST ================= */
app.get("/api/admin/test", protectAdmin, (req, res) => {
  res.json({ message: "Welcome Admin 🎉" });
});

/* ================= DB CONNECTION TEST ================= */

pool.query("SELECT 1")
  .then(() => console.log("PostgreSQL Connected 🚀"))
  .catch((err) =>
    console.error("❌ PostgreSQL connection failed:", err.message)
  );

/* ================= SOCKET SERVER ================= */

const server = http.createServer(app);
initSocket(server);

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
