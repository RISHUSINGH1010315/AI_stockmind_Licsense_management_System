import { useEffect, useState } from "react";
import API from "../../api/axios";

function MyRenewals() {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenewals = async () => {
      try {
        const res = await API.get("/employee/renewals");
        setRenewals(res.data);
      } catch (error) {
        console.error("Renewals fetch error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRenewals();
  }, []);

  const badgeColor = (status) => {
    if (status === "APPROVED") return "bg-green-100 text-green-700";
    if (status === "REJECTED") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Renewal Requests</h1>

      {renewals.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-gray-500">
          No renewal requests found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {renewals.map((r) => (
            <div
              key={r.id}
              className="bg-white p-6 rounded-xl shadow-md border"
            >
              <h2 className="text-lg font-semibold mb-2">
                {r.product_name}
              </h2>

              <p className="text-sm text-gray-600 mb-1">
                Requested:{" "}
                {new Date(r.requested_date).toLocaleDateString()}
              </p>

              {r.renewal_date && (
                <p className="text-sm text-gray-600 mb-1">
                  Renewal Date:{" "}
                  {new Date(r.renewal_date).toLocaleDateString()}
                </p>
              )}

              <span
                className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${badgeColor(
                  r.status
                )}`}
              >
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRenewals;