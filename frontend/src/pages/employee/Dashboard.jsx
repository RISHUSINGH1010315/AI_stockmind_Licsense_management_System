import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Package, Clock, Bell } from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState({
    licenses: 0,
    pendingRenewals: 0,
    notifications: 0
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // ⭐ CORRECT EMPLOYEE API
        const res = await API.get("/employee/dashboard");
        setStats(res.data);
      } catch (err) {
        console.log("Employee dashboard error:", err.response?.data);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Employee Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card title="My Licenses" value={stats.licenses} icon={<Package />} />
        <Card title="Pending Renewals" value={stats.pendingRenewals} icon={<Clock />} />
        <Card title="Notifications" value={stats.notifications} icon={<Bell />} />
      </div>
    </div>
  );
}

const Card = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
    <div className="bg-indigo-500 text-white p-3 rounded-xl">{icon}</div>
    <div>
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value || 0}</h2>
    </div>
  </div>
);

export default Dashboard;