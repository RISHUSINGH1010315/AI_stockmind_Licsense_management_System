import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 6;

function MyLicenses() {
  const [licenses, setLicenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);


  useEffect(() => {
    fetchLicenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [licenses, search, filter]);

  const fetchLicenses = async () => {
    try {
      const res = await API.get("/employee/licenses");

      const updated = res.data.map((lic) => ({
        ...lic,
        status: getStatus(lic.expiry_date),
      }));

      setLicenses(updated);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load licenses");
      setLoading(false);
    }
  };

  const getStatus = (expiryDate) => {
    const today = new Date();
    const exp = new Date(expiryDate);
    const diffDays = (exp - today) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return "Expired";
    if (diffDays < 30) return "Expiring Soon";
    return "Active";
  };

  const applyFilters = () => {
    let data = [...licenses];

    if (search)
      data = data.filter((l) =>
        l.name.toLowerCase().includes(search.toLowerCase())
      );

    if (filter !== "All")
      data = data.filter((l) => l.status === filter);

    setFiltered(data);
    setPage(1);
  };

  const requestRenewal = async (productId) => {
    try {
      await API.post("/employee/renewals", {
        product_id: productId,
      });

      toast.success("Renewal request sent successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send renewal request"
      );
    }
  };

  const badgeColor = (status) => {
    if (status === "Active") return "bg-green-100 text-green-700";
    if (status === "Expired") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Licenses</h1>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search license..."
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Active</option>
          <option>Expired</option>
          <option>Expiring Soon</option>
        </select>
      </div>

      {/* Cards */}
      {paginated.length === 0 ? (
        <p>No licenses found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((lic) => (
            <div
              key={lic.id}
              className="bg-white shadow-md rounded-xl p-6 border hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold mb-2">{lic.name}</h2>

              <p className="text-gray-500 mb-2">
                Expiry: {new Date(lic.expiry_date).toDateString()}
              </p>

              <span
                className={`px-3 py-1 text-sm rounded-full ${badgeColor(
                  lic.status
                )}`}
              >
                {lic.status}
              </span>

              {lic.status === "Expired" && (
                <button
                  onClick={() => requestRenewal(lic.product_id)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Request Renewal
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-3">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded ${page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
              }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MyLicenses;