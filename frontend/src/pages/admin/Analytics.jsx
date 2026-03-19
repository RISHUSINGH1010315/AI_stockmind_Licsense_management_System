import { useEffect, useState } from "react";
import API from "../../api/axios";
import CountUp from "react-countup";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Legend
} from "recharts";

export default function Analytics() {
  const [stats, setStats] = useState({});
  const [insights, setInsights] = useState({});
  const [monthlySales, setMonthlySales] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const dashboard = await API.get("/analytics/dashboard");
      const products = await API.get("/analytics/products");
      const monthly = await API.get("/analytics/monthly-sales");
      const category = await API.get("/analytics/categories");

      setStats(dashboard.data || {});
      setInsights(products.data || {});
      setMonthlySales(monthly.data || []);
      setCategories(category.data || []);
    } catch (error) {
      console.error("Analytics Error:", error);
    }
  };

  /* ===== PDF EXPORT ===== */
  const exportPDF = async () => {
    const element = document.getElementById("analytics-report");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save("analytics.pdf");
  };

  const growth =
    stats.totalRevenue && stats.stockValue
      ? ((stats.totalRevenue / stats.stockValue) * 100).toFixed(1)
      : 0;

  return (
    <div
      id="analytics-report"
      className="p-6 space-y-10 bg-gray-100 min-h-screen text-gray-800"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">
          Inventory Analytics
        </h1>

        <button
          onClick={exportPDF}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Export PDF
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card title="Total Products" value={stats.totalProducts} />
        <Card title="Stock Value" value={stats.stockValue} isMoney />
        <Card
          title="Revenue"
          value={stats.totalRevenue}
          isMoney
          growth={growth}
        />
        <Card
          title="Low Stock"
          value={stats.lowStockProducts?.length || 0}
        />
      </div>

      {/* BAR CHART */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-black">
          Monthly Revenue
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#000" />
            <YAxis stroke="#000" />
            <Tooltip />
            <Bar dataKey="revenue" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-black">
          Category Revenue
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categories}
              dataKey="revenue"
              nameKey="category"
              outerRadius={100}
              fill="#4f46e5"
            />
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* RESTOCK PANEL */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold text-lg text-black mb-3">
          Smart Restock Recommendation
        </h3>

        {stats.lowStockProducts?.length > 0 ? (
          stats.lowStockProducts.map((p, i) => (
            <div key={i} className="text-gray-700 py-1">
              • Restock <strong>{p.item_name}</strong> (Only {p.available_qty} left)
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            All products sufficiently stocked.
          </p>
        )}
      </div>

      {/* FAST / SLOW PRODUCTS */}
      <div className="grid md:grid-cols-2 gap-6">
        <ProductList
          title="Fast Moving Products"
          data={insights.fastMoving}
        />
        <ProductList
          title="Slow Moving Products"
          data={insights.slowMoving}
        />
      </div>
    </div>
  );
}

/* ===== CARD ===== */
function Card({ title, value, isMoney, growth }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-gray-500 text-sm">{title}</h3>

      <p className="text-3xl font-bold text-black mt-2">
        {isMoney && "₹ "}
        <CountUp end={Number(value) || 0} duration={1.5} separator="," />
      </p>

      {Number(growth) > 0 && (
        <p className="text-green-600 text-sm mt-1">
          ↑ {growth}% Growth
        </p>
      )}
    </div>
  );
}

/* ===== PRODUCT LIST ===== */
function ProductList({ title, data }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-black mb-4">
        {title}
      </h3>

      {data?.length > 0 ? (
        data.map((item, index) => (
          <div
            key={index}
            className="flex justify-between py-2 border-b text-gray-700"
          >
            <span>Item ID: {item.item_id}</span>
            <span className="font-semibold">
              {item.total_sold}
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No Data Available</p>
      )}
    </div>
  );
}