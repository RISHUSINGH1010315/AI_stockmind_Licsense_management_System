import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

function Renewals() {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRenewals = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/renewals");
      setRenewals(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load renewals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewals();
  }, []);

  const approve = async (id) => {
    try {
      await API.put(`/admin/renewals/approve/${id}`);
      toast.success("Renewal Approved");
      fetchRenewals();
    } catch {
      toast.error("Approval failed");
    }
  };

  const reject = async (id) => {
    try {
      await API.put(`/admin/renewals/reject/${id}`);
      toast.success("Renewal Rejected");
      fetchRenewals();
    } catch {
      toast.error("Reject failed");
    }
  };

  const getStatusBadge = (status) => {
    status = status?.toLowerCase();

    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Renewal Requests
      </h1>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-slate-900 text-white uppercase tracking-wide text-xs">
            <tr>
              <th className="p-4">Employee</th>
              <th>License</th>
              <th>Requested On</th>
              <th>Status</th>
              <th>Payment</th>
              <th>AI Decision</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-10 text-center text-gray-500">
                  Loading renewals...
                </td>
              </tr>
            ) : renewals.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-10 text-center text-gray-500">
                  No renewal requests found
                </td>
              </tr>
            ) : (
              renewals.map((r) => (
                <tr
                  key={r.id}
                  className={`text-center border-b transition duration-200 hover:bg-gray-50 ${r.status === "approved" &&
                    r.payment_status !== "paid"
                    ? "bg-yellow-50"
                    : ""
                    }`}
                >
                  <td className="p-4 font-medium text-gray-800">
                    {r.employee_name}
                  </td>

                  <td>{r.product_name}</td>

                  <td>
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  {/* PAYMENT */}
                  <td>
                    {r.payment_status === "Pending Payment" ? (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Pending Payment 💳
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                        Not Required
                      </span>
                    )}
                  </td>

                  {/* AI DECISION */}
                  <td>
                    <span
                      className={`font-semibold ${r.aiDecision === "approve"
                        ? "text-green-600"
                        : r.aiDecision === "reject"
                          ? "text-red-600"
                          : "text-yellow-600"
                        }`}
                    >
                      {r.aiDecision || "Pending"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="space-x-2">
                    {r.status?.toLowerCase() === "pending" && (
                      <>
                        <button
                          onClick={() => approve(r.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => reject(r.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {r.status?.toLowerCase() === "approved" && (
                      <span className="text-green-600 font-semibold">
                        Renewal Completed ✔
                      </span>
                    )}

                    {r.status?.toLowerCase() === "rejected" && (
                      <span className="text-red-600 font-semibold">
                        Renewal Rejected
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Renewals;