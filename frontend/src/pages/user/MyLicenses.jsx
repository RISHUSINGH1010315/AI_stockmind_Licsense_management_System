import { useEffect, useState } from "react";
import axios from "axios";
import UserLayout from "../../layouts/UserLayout";
import toast from "react-hot-toast";

function MyLicenses() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyLicenses();
  }, []);

  const fetchMyLicenses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/employee/licenses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLicenses(res.data);
    } catch (err) {
      toast.error("Failed to load licenses");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Request renewal
  const requestRenewal = async (license) => {
    try {
      await axios.post(
        "http://localhost:5000/api/renewals",
        {
          product_id: license.product_id,
          expiry_date: license.expiry_date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Renewal requested 🚀");
    } catch (err) {
      toast.error("Failed to request renewal");
    }
  };

  const statusColor = (status) => {
    if (status === "Active") return "bg-green-100 text-green-600";
    if (status === "Expired") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <UserLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">My Licenses</h1>

        {loading ? (
          <p>Loading...</p>
        ) : licenses.length === 0 ? (
          <p>No licenses found</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {licenses.map((license) => (
              <div
                key={license.id}
                className="bg-white p-6 rounded-xl shadow border"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {license.product_name}
                </h2>

                <p className="text-gray-500">
                  Expiry:{" "}
                  {new Date(license.expiry_date).toLocaleDateString()}
                </p>

                <span
                  className={`px-3 py-1 text-sm rounded-full mt-3 inline-block ${statusColor(
                    license.status
                  )}`}
                >
                  {license.status}
                </span>

                {/* 🔥 Renewal button */}
                <button
                  onClick={() => requestRenewal(license)}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  Request Renewal
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default MyLicenses;