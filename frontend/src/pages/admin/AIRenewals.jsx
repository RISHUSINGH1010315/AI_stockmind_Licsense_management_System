import { useEffect, useState } from "react";
import axios from "axios";

function AIRenewals() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAI();
  }, []);

  const fetchAI = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/ai-renewals",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const riskColor = (risk) => {
    if (risk === "LOW") return "bg-green-100 text-green-700";
    if (risk === "MEDIUM") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="max-w-6xl mx-auto text-black">

      {/* Force Black Heading */}
      <h1 className="text-4xl font-bold text-black mb-8">
        AI Renewal Predictions 🤖
      </h1>

      <div className="bg-white text-black rounded-2xl shadow-xl border overflow-hidden">

        <table className="w-full text-left text-black">
          <thead className="bg-gray-100 border-b text-black">
            <tr>
              <th className="p-4 text-black font-semibold">Employee</th>
              <th className="p-4 text-black font-semibold">Product</th>
              <th className="p-4 text-black font-semibold">Days Left</th>
              <th className="p-4 text-black font-semibold">Probability</th>
              <th className="p-4 text-black font-semibold">Risk</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-black">{row.employee_name}</td>
                <td className="p-4 text-black">{row.product_name}</td>
                <td className="p-4 text-black">{row.daysLeft}</td>

                <td className="p-4 font-semibold text-indigo-600">
                  {row.probability}%
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${riskColor(
                      row.risk
                    )}`}
                  >
                    {row.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}

export default AIRenewals;