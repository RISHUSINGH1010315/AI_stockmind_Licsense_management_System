import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import socket from "./socket";

/* AUTH */
import Login from "./pages/auth/Login";

/* ROUTE GUARDS */
import AdminRoute from "./components/AdminRoute";
import EmployeeRoute from "./components/EmployeeRoute";
import SuperAdminRoute from "./components/SuperAdminRoute";

/* LAYOUTS */
import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

/* ADMIN */
import AdminDashboard from "./pages/admin/AdminDashboard";
import Products from "./pages/admin/Products";
import Licenses from "./pages/admin/Licenses";
import Renewals from "./pages/admin/Renewals";
import Logs from "./pages/admin/Logs";
import Users from "./pages/admin/Users";
import AssignLicense from "./pages/admin/AssignLicense";
import Payments from "./pages/admin/Payments";
import AIRenewals from "./pages/admin/AIRenewals";
import Analytics from "./pages/admin/Analytics";

/* INVENTORY */
import InventoryList from "./pages/inventory/InventoryList";
import StockIn from "./pages/inventory/StockIn";
import StockOut from "./pages/inventory/StockOut";
import StockInHistory from "./pages/inventory/StockInHistory";
import StockOutHistory from "./pages/inventory/StockOutHistory";

/* AI */
import DemandForecast from "./pages/admin/DemandForecast";
import LowStockAlerts from "./pages/admin/LowStockAlerts";
import AutoReorderAI from "./pages/admin/AutoReorderAI";
import ForecastTrend from "./pages/admin/ForecastTrend";

/* EMPLOYEE */
import EmployeeDashboard from "./pages/employee/Dashboard";
import MyRenewals from "./pages/employee/MyRenewals";
import MyLicenses from "./pages/employee/MyLicenses";

/* SUPER ADMIN */
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import AdminManagement from "./pages/superadmin/AdminManagement";
import CreateAdmin from "./pages/superadmin/CreateAdmin";
import CompanyManagement from "./pages/superadmin/CompanyManagement";
import LicenseOverview from "./pages/superadmin/LicenseOverview";
import SystemLogs from "./pages/superadmin/SystemLogs";
import PlatformAnalytics from "./pages/superadmin/PlatformAnalytics";
import CompanyDetails from "./pages/superadmin/CompanyDetails";
import PlanManagement from "./pages/superadmin/PlanManagement";
import RevenueDashboard from "./pages/superadmin/RevenueDashboard";
import Subscriptions from "./pages/superadmin/Subscriptions";
import SuperAdminPayments from "./pages/superadmin/Payments";

/* COMPANY */
import ChoosePlan from "./pages/company/ChoosePlan";


function App() {

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) socket.connect();

    return () => socket.disconnect();

  }, []);

  return (

    <BrowserRouter>

      <Toaster position="top-right" />

      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />

        {/* COMPANY PLAN */}
        <Route path="/choose-plan" element={<ChoosePlan />} />

        {/* EMPLOYEE */}
        <Route element={<EmployeeRoute />}>

          <Route path="/employee" element={<EmployeeLayout />}>

            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="licenses" element={<MyLicenses />} />
            <Route path="renewals" element={<MyRenewals />} />

          </Route>

        </Route>


        {/* ADMIN */}
        <Route element={<AdminRoute />}>

          <Route path="/admin" element={<AdminLayout />}>

            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="licenses" element={<Licenses />} />
            <Route path="renewals" element={<Renewals />} />
            <Route path="users" element={<Users />} />
            <Route path="logs" element={<Logs />} />
            <Route path="assign-license" element={<AssignLicense />} />
            <Route path="payments" element={<Payments />} />
            <Route path="ai-renewals" element={<AIRenewals />} />

            {/* INVENTORY */}
            <Route path="inventory" element={<InventoryList />} />
            <Route path="stock-in" element={<StockIn />} />
            <Route path="stock-out" element={<StockOut />} />
            <Route path="stock-in-history" element={<StockInHistory />} />
            <Route path="stock-out-history" element={<StockOutHistory />} />

            {/* ANALYTICS */}
            <Route path="analytics" element={<Analytics />} />

            {/* AI */}
            <Route path="forecast" element={<DemandForecast />} />
            <Route path="alerts" element={<LowStockAlerts />} />
            <Route path="ai-reorder" element={<AutoReorderAI />} />
            <Route path="forecast-trend" element={<ForecastTrend />} />

          </Route>

        </Route>


        {/* SUPER ADMIN */}
        <Route element={<SuperAdminRoute />}>

          <Route path="/super-admin" element={<SuperAdminLayout />}>

            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="admins" element={<AdminManagement />} />
            <Route path="create-admin" element={<CreateAdmin />} />
            <Route path="companies" element={<CompanyManagement />} />
            <Route path="licenses" element={<LicenseOverview />} />
            <Route path="system-logs" element={<SystemLogs />} />
            <Route path="analytics" element={<PlatformAnalytics />} />
            <Route path="companies/:id" element={<CompanyDetails />} />
            <Route path="plans" element={<PlanManagement />} />
            <Route path="revenue" element={<RevenueDashboard />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="payments" element={<SuperAdminPayments />} />

          </Route>

        </Route>


        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;