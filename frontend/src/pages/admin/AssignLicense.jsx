import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AssignLicense() {
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [productId, setProductId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const empRes = await axios.get(
        "http://localhost:5000/api/admin/employees",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const prodRes = await axios.get(
        "http://localhost:5000/api/admin/products",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // safe handling (works for both array & pg rows format)
      const employeeData = Array.isArray(empRes.data)
        ? empRes.data
        : empRes.data.rows || [];

      const productData = Array.isArray(prodRes.data)
        ? prodRes.data
        : prodRes.data.rows || [];

      setEmployees(employeeData);
      setProducts(productData);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load data");
    }
  };

  const assign = async () => {
    // ✅ validation
    if (!employeeId || !productId) {
      return toast.error("Select employee and product");
    }

    try {
      // ✅ IMPORTANT FIXES:
      // 1) remove expiryDate (DB doesn't have column)
      // 2) convert IDs to Number (PostgreSQL needs integers)
      await axios.post(
        "http://localhost:5000/api/admin/assign-license",
        {
          employeeId: Number(employeeId),
          productId: Number(productId),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("License Assigned 🎉");

      // reset dropdowns after success
      setEmployeeId("");
      setProductId("");
    } catch (err) {
      console.log(err);
      toast.error("Assignment failed");
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Assign License
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-lg space-y-5 border">

        {/* EMPLOYEE DROPDOWN */}
        <div>
          <label className="text-sm font-semibold text-gray-600">
            Select Employee
          </label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="mt-2 w-full border border-gray-300 p-3 rounded-lg 
            bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Choose employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.email})
              </option>
            ))}
          </select>
        </div>

        {/* PRODUCT DROPDOWN */}
        <div>
          <label className="text-sm font-semibold text-gray-600">
            Select Product
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-2 w-full border border-gray-300 p-3 rounded-lg 
            bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Choose product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTON */}
        <button
          onClick={assign}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Assign License
        </button>
      </div>
    </div>
  );
}

export default AssignLicense;