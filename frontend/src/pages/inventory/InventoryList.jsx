import { useEffect, useState } from "react";
import API from "../../api/axios";

function InventoryList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const res = await API.get("/inventory/items");
    setItems(res.data);
  };

  return (
    <div>
      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Inventory
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="p-4 text-left">Item</th>
              <th className="p-4 text-center">Total Qty</th>
              <th className="p-4 text-center">Available Qty</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {items.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">
                  No inventory found
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-semibold">{item.item_name}</td>
                  <td className="p-4 text-center">{item.total_qty}</td>
                  <td className="p-4 text-center font-bold text-indigo-600">
                    {item.available_qty}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default InventoryList;