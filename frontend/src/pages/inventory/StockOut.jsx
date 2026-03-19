import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

function StockOut() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    item_id: "",
    qty: "",
    price_per_unit: "",
    customer_name: "",
    vehicle_no: "",
    gst_number: "",
    notes: ""
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await API.get("/inventory/items");
    setItems(res.data);
  };

  const submit = async () => {
    try {
      await API.post("/inventory/stock-out", form);
      toast.success("Stock Out successful");
    } catch {
      toast.error("Error");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md text-gray-900">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Stock Out
        </h1>

        <div className="space-y-4">

          <select
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setForm({ ...form, item_id: e.target.value })}
          >
            <option value="">Select Item</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.item_name}
              </option>
            ))}
          </select>

          <input
            placeholder="Quantity"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setForm({ ...form, qty: e.target.value })}
          />

          <input
            placeholder="Price per unit"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setForm({ ...form, price_per_unit: e.target.value })}
          />

          <input
            placeholder="Customer"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
          />

          <input
            placeholder="Vehicle No"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setForm({ ...form, vehicle_no: e.target.value })}
          />

          <input
            placeholder="GST"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setForm({ ...form, gst_number: e.target.value })}
          />

          <textarea
            placeholder="Notes"
            rows="3"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button
            onClick={submit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Dispatch
          </button>

        </div>
      </div>
    </div>
  );
}

export default StockOut;