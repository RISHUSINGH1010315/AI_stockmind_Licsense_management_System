import { useEffect, useState } from "react";
import axios from "axios";

function Logs() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/logs",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">

      {/* Heading */}
      <h1 className="text-4xl font-bold text-black mb-8">
        Activity Logs
      </h1>

      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">

        {logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-lg">
            No activity yet 📭
          </div>
        ) : (
          <table className="w-full text-left">
            {/* Header */}
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-black font-semibold">Admin</th>
                <th className="p-4 text-black font-semibold">Action</th>
                <th className="p-4 text-black font-semibold">Details</th>
                <th className="p-4 text-black font-semibold">Date</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {logs.map((log, index) => (
                <tr
                  key={log.id}
                  className={`border-b hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                  }`}
                >
                  <td className="p-4 text-black font-medium">
                    {log.admin || "System"}
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700">
                      {log.action}
                    </span>
                  </td>

                  <td className="p-4 text-black">
                    {log.details || "-"}
                  </td>

                  <td className="p-4 text-gray-600">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Logs;