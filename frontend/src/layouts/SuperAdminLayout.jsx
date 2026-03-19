import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import {
  FaChartBar,
  FaUsers,
  FaCrown,
  FaBuilding,
  FaKey,
  FaClipboardList,
  FaDollarSign,
  FaCreditCard,
  FaSignOutAlt,
  FaBars
} from "react-icons/fa";

import NotificationBell from "../components/NotificationBell";

function SuperAdminLayout() {

  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const active = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}

      <aside
        className={`bg-black text-white flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >

        {/* HEADER */}

        <div className="flex items-center justify-between p-4 border-b border-gray-800">

          {!collapsed && (
            <div className="flex items-center gap-2">
              <FaCrown className="text-purple-500" />
              <span className="font-bold">StockMind</span>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white"
          >
            <FaBars />
          </button>

        </div>

        {/* NAVIGATION */}

        <div className="flex-1 p-3 space-y-2">

          <SidebarItem
            icon={<FaChartBar />}
            label="Dashboard"
            collapsed={collapsed}
            active={active("/super-admin/dashboard")}
            onClick={() => navigate("/super-admin/dashboard")}
          />

          <SidebarItem
            icon={<FaUsers />}
            label="Admins"
            collapsed={collapsed}
            active={active("/super-admin/admins")}
            onClick={() => navigate("/super-admin/admins")}
          />

          <SidebarItem
            icon={<FaBuilding />}
            label="Companies"
            collapsed={collapsed}
            active={active("/super-admin/companies")}
            onClick={() => navigate("/super-admin/companies")}
          />

          <SidebarItem
            icon={<FaKey />}
            label="Licenses"
            collapsed={collapsed}
            active={active("/super-admin/licenses")}
            onClick={() => navigate("/super-admin/licenses")}
          />

          <SidebarItem
            icon={<FaClipboardList />}
            label="Logs"
            collapsed={collapsed}
            active={active("/super-admin/system-logs")}
            onClick={() => navigate("/super-admin/system-logs")}
          />

          <SidebarItem
            icon={<FaChartBar />}
            label="Analytics"
            collapsed={collapsed}
            active={active("/super-admin/analytics")}
            onClick={() => navigate("/super-admin/analytics")}
          />

          <SidebarItem
            icon={<FaDollarSign />}
            label="Plans"
            collapsed={collapsed}
            active={active("/super-admin/plans")}
            onClick={() => navigate("/super-admin/plans")}
          />

          <SidebarItem
            icon={<FaDollarSign />}
            label="Revenue"
            collapsed={collapsed}
            active={active("/super-admin/revenue")}
            onClick={() => navigate("/super-admin/revenue")}
          />

          <SidebarItem
            icon={<FaCreditCard />}
            label="Subscriptions"
            collapsed={collapsed}
            active={active("/super-admin/subscriptions")}
            onClick={() => navigate("/super-admin/subscriptions")}
          />

          <SidebarItem
            icon={<FaDollarSign />}
            label="Payments"
            collapsed={collapsed}
            active={active("/super-admin/payments")}
            onClick={() => navigate("/super-admin/payments")}
          />

        </div>

        {/* LOGOUT */}

        <div className="p-3 border-t border-gray-800">

          <SidebarItem
            icon={<FaSignOutAlt />}
            label="Logout"
            collapsed={collapsed}
            danger
            onClick={logout}
          />

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}

        <header className="h-16 bg-white border-b flex items-center justify-between px-6">

          <h1 className="font-semibold text-black">
            Platform Control Panel
          </h1>

          <div className="flex items-center gap-4">

            <NotificationBell />

            <span className="text-sm text-gray-500">
              Super Admin
            </span>

          </div>

        </header>

        {/* PAGE CONTENT */}

        <main className="flex-1 overflow-y-auto p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

////////////////////////////////////////////////////////////
// SIDEBAR ITEM COMPONENT
////////////////////////////////////////////////////////////

function SidebarItem({ icon, label, onClick, active, collapsed, danger }) {

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition
      ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : active
          ? "bg-purple-600 text-white"
          : "hover:bg-gray-800 text-gray-300"
      }`}
    >

      <span className="text-lg">{icon}</span>

      {!collapsed && <span className="text-sm">{label}</span>}

    </div>
  );
}

export default SuperAdminLayout;