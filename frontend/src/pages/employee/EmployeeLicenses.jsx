import { useEffect, useState } from "react";
import axios from "../../api/axios";
import toast from "react-hot-toast";
import LicenseCard from "../../components/employee/LicenseCard.jsx";

function EmployeeLicenses() {
  const [licenses, setLicenses] = useState([]);

  const fetchLicenses = async () => {
    try {
      const res = await axios.get("/employee/licenses");
      setLicenses(res.data);
    } catch {
      toast.error("Failed to load licenses");
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const requestRenewal = async (licenseId) => {
    try {
      await axios.post("/employee/renewals", { license_id: licenseId });
      toast.success("Renewal request sent 🚀");
    } catch {
      toast.error("Renewal request failed");
    }
  };

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">My Licenses</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {licenses.map((license) => (
          <LicenseCard
            key={license.id}
            license={license}
            onRenew={requestRenewal}
          />
        ))}
      </div>
    </div>
  );
}

export default EmployeeLicenses;