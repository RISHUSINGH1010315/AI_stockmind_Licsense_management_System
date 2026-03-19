import { useEffect, useRef, useState } from "react";
import API from "../../api/axios";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer,
} from "recharts";

function AdminDashboard() {

  // ⭐ prevent double API calls in React StrictMode
  const hasFetched = useRef(false);

  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    licenses: 0,
    pendingRenewals: 0,
  });

  const [revenue, setRevenue] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
  });

  // 🔥 AI Analytics State
  const [analytics, setAnalytics] = useState({
    totalLowStock: 0,
    totalPurchaseCost: 0,
    totalPredictedRevenue: 0,
    topRiskProduct: "",
  });

  //////////////////////////////////////////////////////
  // FETCH DASHBOARD DATA (RUN ONLY ONCE)
  //////////////////////////////////////////////////////
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        const statsRes = await API.get("/admin/stats");
        const revenueRes = await API.get("/admin/revenue");
        const analyticsRes = await API.get("/forecast/analytics/summary");

        setStats({
          users: statsRes.data?.users || 0,
          products: statsRes.data?.products || 0,
          licenses: statsRes.data?.licenses || 0,
          pendingRenewals: statsRes.data?.pendingRenewals || 0,
        });

        setRevenue({
          totalRevenue: revenueRes.data?.totalRevenue || 0,
          monthlyRevenue: revenueRes.data?.monthlyRevenue || 0,
        });

        setAnalytics({
          totalLowStock: analyticsRes.data?.totalLowStock || 0,
          totalPurchaseCost: analyticsRes.data?.totalPurchaseCost || 0,
          totalPredictedRevenue: analyticsRes.data?.totalPredictedRevenue || 0,
          topRiskProduct: analyticsRes.data?.topRiskProduct || "",
        });

      } catch (err) {
        console.log("Admin dashboard error:", err.response?.data || err.message);
      }
    };

    fetchData();
  }, []);

  //////////////////////////////////////////////////////
  // CHART DATA
  //////////////////////////////////////////////////////
  const pieData = [
    { name: "Users", value: stats.users },
    { name: "Products", value: stats.products },
  ];

  const barData = [
    { name: "Pending", value: stats.pendingRenewals },
    { name: "Licenses", value: stats.licenses },
  ];

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////
  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* ORIGINAL STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <Card title="Users" value={stats.users} />
        <Card title="Products" value={stats.products} />
        <Card title="Licenses" value={stats.licenses} />
        <Card title="Pending Renewals" value={stats.pendingRenewals} />
        <Card title="Total Revenue" value={`₹ ${revenue.totalRevenue}`} />
        <Card title="This Month" value={`₹ ${revenue.monthlyRevenue}`} />
      </div>

      {/* 🔥 AI ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <Card
          title="Low Stock Products"
          value={analytics.totalLowStock}
        />

        <Card
          title="Total Purchase Cost"
          value={`₹ ${analytics.totalPurchaseCost.toLocaleString()}`}
        />

        <Card
          title="Next Month Revenue (AI)"
          value={`₹ ${analytics.totalPredictedRevenue.toLocaleString()}`}
        />

        <Card
          title="Top Risk Product"
          value={analytics.topRiskProduct || "None"}
        />

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            System Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100}>
                <Cell fill="#6366f1" />
                <Cell fill="#22c55e" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            Renewal Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}

//////////////////////////////////////////////////////
// CARD COMPONENT
//////////////////////////////////////////////////////
const Card = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-bold mt-2">{value}</h2>
  </div>
);

export default AdminDashboard;