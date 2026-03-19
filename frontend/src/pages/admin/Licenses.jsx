import { useEffect, useState } from "react";
import axios from "axios";

function Licenses() {
  const [licenses, setLicenses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const checkExpired = async () => {
    try {
      await axios.get("http://localhost:5000/api/licenses/check-expired");
      fetchLicenses();
    } catch (err) {
      console.log(err);
      alert("Error checking expired licenses");
    }
  };

  const fetchLicenses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/licenses",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLicenses(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchLicenses, 60000);
    return () => clearInterval(interval);
  }, []);

  const getRemainingTime = (expiryDate) => {
    const diff = new Date(expiryDate) - new Date();
    if (diff <= 0) return "Expired";
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    return `${h}h ${m}m`;
  };

  const filteredLicenses = licenses.filter((l) => {
    const employee = l.employee_name?.toLowerCase() || "";
    const product = l.product_name?.toLowerCase() || "";
    const term = search.toLowerCase();

    return employee.includes(term) || product.includes(term);
  });

  return (
    <div className="h-[calc(100vh-80px)] bg-gray-100 p-10 flex flex-col overflow-hidden">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          License Tracking ⏱️
        </h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={checkExpired}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Check Expired Licenses
          </button>

          <input
            type="text"
            placeholder="Search by email or product..."
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 outline-none focus:ring-2 ring-indigo-500 w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow p-6 flex-1 overflow-hidden">

        <div className="overflow-y-auto h-full">
          <table className="min-w-full text-left">

            {/* Sticky Header */}
            <thead className="bg-gray-100 sticky top-0 z-10 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">User</th>
                <th className="p-4">License Key</th>
                <th className="p-4">Status</th>
                <th className="p-4">Expires At</th>
                <th className="p-4">Time Left</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">

              {loading && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    Loading licenses...
                  </td>
                </tr>
              )}

              {!loading && filteredLicenses.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    No licenses booked yet 😴
                  </td>
                </tr>
              )}

              {filteredLicenses.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-800">{l.product_name}</td>
                  <td className="p-4 text-gray-600">{l.employee_name}</td>
                  <td className="p-4 text-indigo-600 font-semibold">LIC-{l.id}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${l.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                        }`}
                    >
                      {l.status}
                    </span>
                  </td>

                  <td className="p-4 text-gray-600">
                    {new Date(l.expiry_date).toLocaleDateString()}
                  </td>

                  <td className="p-4 font-bold text-indigo-600">
                    {getRemainingTime(l.expiry_date)}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Licenses;