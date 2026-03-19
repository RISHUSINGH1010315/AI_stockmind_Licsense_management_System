import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function RenewalRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/renewals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approve = async (id) => {
    await axios.put(
      `http://localhost:5000/api/renewals/approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Approved");
    fetchRequests();
  };

  const reject = async (id) => {
    await axios.put(
      `http://localhost:5000/api/renewals/reject/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Rejected");
    fetchRequests();
  };

  const badge = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading)
    return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Renewal Requests</h1>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-sm text-gray-500">
            <tr>
              <th className="p-4 text-left">Employee</th>
              <th className="p-4 text-left">License</th>
              <th className="p-4 text-left">Requested On</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">AI Suggestion</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-4">{r.employee_name}</td>
                <td className="p-4">{r.license_name}</td>
                <td className="p-4">
                  {new Date(r.created_at).toDateString()}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded ${badge(r.status)}`}>
                    {r.status}
                  </span>
                </td>

                {/* 🤖 AI Suggestion */}
                <td className="p-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded">
                    {r.aiDecision}
                  </span>
                </td>

                <td className="p-4 space-x-2">
                  {r.status?.toLowerCase() === "pending" ? (
                    <>
                      <button
                        onClick={() => approve(r.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => reject(r.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 italic">No action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RenewalRequests;