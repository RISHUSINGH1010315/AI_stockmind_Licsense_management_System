import { useEffect, useState } from "react";
import API from "../../api/axios";

import {
  Users,
  Shield,
  User,
  DollarSign,
  Sparkles
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function SuperAdminDashboard() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalEmployees: 0,
    totalRevenue: 0
  });

  const [aiInsights, setAiInsights] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  ////////////////////////////////////////////////////
  // FETCH STATS
  ////////////////////////////////////////////////////

  const fetchStats = async () => {

    try {

      const res = await API.get("/super-admin/stats");

      setStats({
        totalUsers: res.data?.totalUsers || 0,
        totalAdmins: res.data?.totalAdmins || 0,
        totalEmployees: res.data?.totalEmployees || 0,
        totalRevenue: res.data?.totalRevenue || 0
      });

    } catch (err) {

      console.log("Stats error", err);

    } finally {

      setLoading(false);

    }

  };

  ////////////////////////////////////////////////////
  // FETCH AI INSIGHTS
  ////////////////////////////////////////////////////

  const fetchAI = async () => {

    try {

      const res = await API.get("/super-admin/ai-insights");

      const data = res.data;

      if (Array.isArray(data)) {
        setAiInsights(data);
      } else if (Array.isArray(data.insights)) {
        setAiInsights(data.insights);
      } else {
        setAiInsights([]);
      }

    } catch {

      setAiInsights([]);

    }

  };

  ////////////////////////////////////////////////////
  // FETCH REVENUE CHART
  ////////////////////////////////////////////////////

  const fetchRevenueChart = async () => {

    try {

      const res = await API.get("/super-admin/revenue");

      setRevenueData(res.data);

    } catch (err) {

      console.log("Revenue chart error", err);

    }

  };

  ////////////////////////////////////////////////////

  useEffect(() => {

    fetchStats();
    fetchAI();
    fetchRevenueChart();

  }, []);

  ////////////////////////////////////////////////////

  if (loading) {

    return (

      <div className="flex items-center justify-center h-[70vh]">

        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600"></div>

      </div>

    );

  }

  ////////////////////////////////////////////////////

  return (

    <div className="space-y-10">

      {/* PAGE TITLE */}

      <div>

        <h1 className="text-3xl font-bold text-black">
          Super Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Global platform analytics and insights
        </p>

      </div>


      {/* STAT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={22} />}
          color="from-blue-500 to-blue-600"
        />

        <StatCard
          title="Total Admins"
          value={stats.totalAdmins}
          icon={<Shield size={22} />}
          color="from-indigo-500 to-indigo-600"
        />

        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<User size={22} />}
          color="from-purple-500 to-purple-600"
        />

        <StatCard
          title="Total Revenue"
          value={`₹ ${stats.totalRevenue}`}
          icon={<DollarSign size={22} />}
          color="from-green-500 to-green-600"
        />

      </div>


      {/* CHARTS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* REVENUE CHART */}

        <div className="bg-white rounded-xl border shadow-sm p-6">

          <h2 className="text-lg font-semibold text-black mb-4">
            Revenue Trend
          </h2>

          <ResponsiveContainer width="100%" height={250}>

            <LineChart data={revenueData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>


        {/* PLATFORM STATUS */}

        <div className="bg-white rounded-xl border shadow-sm p-6">

          <h2 className="text-lg font-semibold text-black mb-4">
            Platform Status
          </h2>

          <div className="space-y-4 text-sm">

            <StatusRow
              label="Platform Health"
              value="Operational"
              color="text-green-600"
            />

            <StatusRow
              label="Active Admins"
              value={stats.totalAdmins}
            />

            <StatusRow
              label="Active Employees"
              value={stats.totalEmployees}
            />

            <StatusRow
              label="Registered Users"
              value={stats.totalUsers}
            />

          </div>

        </div>

      </div>


      {/* AI INSIGHTS */}

      <div className="bg-white rounded-xl border shadow-sm p-6">

        <div className="flex items-center gap-2 mb-4">

          <Sparkles className="text-indigo-500" />

          <h2 className="text-lg font-semibold text-black">
            AI Insights
          </h2>

        </div>

        {aiInsights.length === 0 && (

          <p className="text-gray-500 text-sm">
            No AI insights available
          </p>

        )}

        <div className="space-y-3">

          {aiInsights.slice(0, 5).map((item, index) => (

            <div
              key={index}
              className="p-4 border rounded-lg hover:bg-gray-50 transition"
            >

              <p className="font-semibold text-black">
                {item.product}
              </p>

              <p className="text-sm text-gray-500">
                Predicted Demand: {item.predictedDemand}
              </p>

              <p className="text-indigo-600 font-medium text-sm">
                AI Suggest Order: {item.reorderSuggestion}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default SuperAdminDashboard;


//////////////////////////////////////////////////
// STAT CARD
//////////////////////////////////////////////////

function StatCard({ title, value, icon, color }) {

  return (

    <div className="bg-white rounded-xl border shadow-sm p-6 flex items-center justify-between hover:shadow-lg transition">

      <div>

        <p className="text-gray-500 text-sm">
          {title}
        </p>

        <h3 className="text-2xl font-bold text-black mt-1">
          {value}
        </h3>

      </div>

      <div className={`bg-gradient-to-r ${color} text-white p-3 rounded-lg shadow`}>
        {icon}
      </div>

    </div>

  );

}

//////////////////////////////////////////////////
// STATUS ROW
//////////////////////////////////////////////////

function StatusRow({ label, value, color }) {

  return (

    <div className="flex justify-between border-b pb-2">

      <span className="text-gray-500">
        {label}
      </span>

      <span className={`font-semibold text-black ${color}`}>
        {value}
      </span>

    </div>

  );

}