import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProducts(res.data);
  };

  const usagePercent = (p) =>
    Math.round((p.occupied / p.total_licenses) * 100 || 0);

  return (
    <div className="max-w-7xl mx-auto text-black">
      <h1 className="text-4xl font-bold mb-8">Products & Licenses</h1>

      {/* ⭐ Scroll container added */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">

          <table className="min-w-[900px] w-full text-left">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Usage</th>
                <th className="p-4">Total</th>
                <th className="p-4">Occupied</th>
                <th className="p-4">Free</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">

                  <td className="p-4 font-semibold">{p.name}</td>

                  <td className="p-4">
                    <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-sm">
                      {p.category}
                    </span>
                  </td>

                  <td className="p-4 w-64">
                    <div className="w-full bg-gray-200 h-3 rounded-full">
                      <div
                        className="bg-indigo-600 h-3 rounded-full"
                        style={{ width: `${usagePercent(p)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {usagePercent(p)}% used
                    </span>
                  </td>

                  <td className="p-4">{p.total_licenses}</td>
                  <td className="p-4 text-red-600 font-semibold">{p.occupied}</td>
                  <td className="p-4 text-green-600 font-semibold">{p.free}</td>

                  <td className="p-4">
                    {p.free <= 5 ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                        Healthy
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => window.location.href = "/admin/assign-license"}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Assign License
                    </button>
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

export default Products;