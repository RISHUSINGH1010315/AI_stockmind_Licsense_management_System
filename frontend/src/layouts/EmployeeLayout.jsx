import { FaHome, FaFileAlt, FaSignOutAlt, FaIdCard } from "react-icons/fa";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import ChatBot from "../components/ChatBot";
import NotificationBell from "../components/NotificationBell";

function EmployeeLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="h-screen overflow-hidden bg-slate-900">

      {/* MAIN FLEX WRAPPER */}
      <div className="flex h-full text-white">

        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900 p-6 fixed left-0 top-0 h-full flex flex-col z-20">
          <div>
            <h2 className="text-2xl font-bold mb-10 text-indigo-400">
              Employee Panel
            </h2>

            <nav className="space-y-3">
              <SidebarItem
                icon={<FaHome />}
                label="Dashboard"
                active={isActive("/employee/dashboard")}
                onClick={() => navigate("/employee/dashboard")}
              />

              <SidebarItem
                icon={<FaIdCard />}
                label="My Licenses"
                active={isActive("/employee/licenses")}
                onClick={() => navigate("/employee/licenses")}
              />

              <SidebarItem
                icon={<FaFileAlt />}
                label="My Renewals"
                active={isActive("/employee/renewals")}
                onClick={() => navigate("/employee/renewals")}
              />
            </nav>
          </div>

          <div className="mt-auto">
            <SidebarItem
              icon={<FaSignOutAlt />}
              label="Logout"
              danger
              onClick={handleLogout}
            />
          </div>
        </aside>

        {/* RIGHT SIDE CONTENT */}
        <div className="ml-64 flex-1 flex flex-col bg-slate-100 text-black relative z-10">

          {/* HEADER */}
          <div className="h-16 bg-white shadow flex items-center justify-end px-8 sticky top-0 z-10">
            <NotificationBell />
          </div>

          {/* PAGE CONTENT */}
          <div className="flex-1 overflow-y-auto p-8">
            <Outlet />
          </div>

        </div>
      </div>

      {/* CHATBOT — ALWAYS ABOVE UI BUT NOT BLOCKING */}
      <div className="fixed bottom-6 right-6 z-30 pointer-events-auto">
        <ChatBot />
      </div>

    </div>
  );
}

function SidebarItem({ icon, label, onClick, active, danger }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
      ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : active
          ? "bg-indigo-600 text-white"
          : "hover:bg-slate-800"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}

export default EmployeeLayout;