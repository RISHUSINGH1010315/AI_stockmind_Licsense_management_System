import { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

function StockIn() {
  const [form, setForm] = useState({
    item_name: "",
    qty: "",
    price_per_unit: "",
    supplier_name: ""
  });

  const total =
    Number(form.qty || 0) * Number(form.price_per_unit || 0);

  const submit = async () => {
    if (!form.item_name || !form.qty || !form.price_per_unit) {
      return toast.error("Please fill required fields");
    }

    try {
      await API.post("/inventory/stock-in", form);
      toast.success("Stock Added Successfully");
      setForm({
        item_name: "",
        qty: "",
        price_per_unit: "",
        supplier_name: ""
      });
    } catch {
      toast.error("Error adding stock");
    }
  };

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Stock In
      </h1>

      {/* CENTER WRAPPER */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl shadow-lg border p-8 w-full max-w-3xl">

          {/* GRID FORM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ITEM NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                value={form.item_name}
                onChange={(e) =>
                  setForm({ ...form, item_name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* SUPPLIER */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier Name
              </label>
              <input
                type="text"
                value={form.supplier_name}
                onChange={(e) =>
                  setForm({ ...form, supplier_name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* QUANTITY */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={form.qty}
                onChange={(e) =>
                  setForm({ ...form, qty: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Per Unit *
              </label>
              <input
                type="number"
                value={form.price_per_unit}
                onChange={(e) =>
                  setForm({ ...form, price_per_unit: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

          </div>

          {/* TOTAL PREVIEW */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
            <p className="text-gray-700">
              Total Amount:
              <span className="font-bold text-indigo-600 ml-2">
                ₹ {total.toLocaleString()}
              </span>
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={submit}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Add Stock
          </button>

        </div>
      </div>
    </div>
  );
}

export default StockIn;