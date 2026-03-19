import { CalendarDays } from "lucide-react";

function LicenseCard({ license, onRenew }) {
  const getStatusColor = () => {
    const today = new Date();
    const expiry = new Date(license.expiry_date);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-600 bg-red-100";
    if (diffDays < 7) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-slate-800 mb-3">
        {license.product_name}
      </h3>

      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <CalendarDays size={18} />
        Expiry: {new Date(license.expiry_date).toLocaleDateString()}
      </div>

      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor()}`}>
        License Active
      </span>

      <button
        onClick={() => onRenew(license.id)}
        className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
      >
        Request Renewal
      </button>
    </div>
  );
}

export default LicenseCard;