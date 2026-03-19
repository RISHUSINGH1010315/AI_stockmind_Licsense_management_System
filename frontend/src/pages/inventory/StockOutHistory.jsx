import { useEffect, useState } from "react";
import API from "../../api/axios";

function StockOutHistory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await API.get("/inventory/stock-out-history");
    setData(res.data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Stock Out History
      </h1>

      <div className="bg-white rounded-xl shadow border overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Price</th>
              <th className="p-3">Total</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">GST</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {data.map((row) => (
              <tr key={row.id} className="border-t text-center">
                <td className="p-3">{row.item_name}</td>
                <td className="p-3">{row.qty}</td>
                <td className="p-3">₹ {row.price_per_unit}</td>
                <td className="p-3 font-semibold">₹ {row.total_amount}</td>
                <td className="p-3">{row.customer_name}</td>
                <td className="p-3">{row.vehicle_no}</td>
                <td className="p-3">{row.gst_number}</td>
                <td className="p-3">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockOutHistory;