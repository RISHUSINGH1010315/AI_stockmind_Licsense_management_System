import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  FaChartBar, FaBox, FaKey, FaSyncAlt,
  FaClipboardList, FaUsers,
  FaPlus, FaTruck, FaSignOutAlt, FaBars,
  FaBell
} from "react-icons/fa";
import API from "../api/axios";

function AdminLayout() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  //////////////////////////////////////////////////////
  // FETCH LOW STOCK ALERTS
  //////////////////////////////////////////////////////
  useEffect(() => {
    let interval;

    const fetchAlerts = async () => {
      try {
        const res = await API.get("/forecast/alerts/low-stock");
        setAlertCount(res.data.count || 0);
        setLowStockProducts(res.data.products || []);
      } catch (error) {
        console.error("Low stock fetch error:", error.message);
      }
    };

    fetchAlerts();
    interval = setInterval(fetchAlerts, 30000);

    return () => clearInterval(interval);
  }, []);

  //////////////////////////////////////////////////////
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  //////////////////////////////////////////////////////
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //////////////////////////////////////////////////////
  // LOGOUT
  //////////////////////////////////////////////////////
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  //////////////////////////////////////////////////////
  // SIDEBAR MENU ITEM
  //////////////////////////////////////////////////////
  const menuItem = (path, label, Icon) => (
    <div
      onClick={() => navigate(path)}
      className={`flex items-center 
        ${collapsed ? "justify-center" : "gap-4"} 
        px-4 py-3 rounded-lg cursor-pointer 
        hover:bg-indigo-500/20 transition`}
    >
      <Icon className="text-lg min-w-[20px]" />
      {!collapsed && (
        <span className="text-sm font-medium">{label}</span>
      )}
    </div>
  );

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////
  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div
        className={`bg-[#020817] text-white flex flex-col
        ${collapsed ? "w-20" : "w-64"} transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          {!collapsed && <h1 className="text-xl font-bold">StockMind AI</h1>}
          <FaBars
            className="cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-3 mt-4 space-y-1">
          {menuItem("/admin/dashboard", "Dashboard", FaChartBar)}
          {menuItem("/admin/analytics", "Analytics", FaChartBar)}
          {menuItem("/admin/products", "Products", FaBox)}
          {menuItem("/admin/licenses", "Licenses", FaKey)}
          {menuItem("/admin/renewals", "Renewals", FaSyncAlt)}
          {menuItem("/admin/payments", "Payments", FaClipboardList)}
          {menuItem("/admin/logs", "Activity Logs", FaClipboardList)}
          {menuItem("/admin/users", "Users", FaUsers)}
          {menuItem("/admin/assign-license", "Assign License", FaKey)}
          {menuItem("/admin/inventory", "Inventory", FaBox)}
          {menuItem("/admin/stock-in", "Stock In", FaPlus)}
          {menuItem("/admin/stock-out", "Stock Out", FaTruck)}
          {menuItem("/admin/stock-in-history", "Stock In History", FaClipboardList)}
          {menuItem("/admin/stock-out-history", "Stock Out History", FaClipboardList)}
        </div>

        <div
          onClick={logout}
          className={`border-t border-gray-700 cursor-pointer hover:text-red-400
          ${collapsed ? "p-4 flex justify-center" : "p-5 flex items-center gap-3"}`}
        >
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="flex justify-end items-center bg-white px-6 py-4 shadow relative">

          <div className="relative" ref={dropdownRef}>

            {/* 🔔 BELL */}
            <div
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative cursor-pointer group"
            >
              <FaBell className="text-2xl text-gray-700 transition-transform duration-300 group-hover:scale-110" />

              {alertCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center">
                    {alertCount}
                  </span>
                </span>
              )}
            </div>

            {/* DROPDOWN */}
            <div
              className={`absolute right-0 mt-4 w-80 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 transition-all duration-300
              ${showNotifications
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="p-4 border-b font-semibold">
                Low Stock Alerts
              </div>

              <div className="max-h-60 overflow-y-auto">
                {alertCount === 0 && (
                  <div className="p-4 text-gray-500">
                    No low stock alerts 🎉
                  </div>
                )}

                {lowStockProducts.map(product => (
                  <div
                    key={product.id}
                    className="p-4 border-b space-y-1"
                  >
                    <div className="font-semibold text-red-600">
                      ⚠ {product.name}
                    </div>

                    <div className="text-sm">
                      Stock: {product.total_licenses} | Reorder Level: {product.reorder_level}
                    </div>

                    <div className="text-sm text-indigo-600">
                      Predicted Demand: {product.predictedDemand}
                    </div>

                    <div className="text-sm font-medium text-green-600">
                      Recommended Order: {product.recommendedOrder}
                    </div>

                    <div className="text-sm font-semibold">
                      Estimated Cost: ₹{(product.estimatedCost || 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 text-center border-t">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default AdminLayout;