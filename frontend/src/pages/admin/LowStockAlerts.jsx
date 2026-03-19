import { useEffect, useState } from "react";
import API from "../../api/axios";

function LowStockAlerts(){

  const [alerts,setAlerts] = useState([]);

  useEffect(()=>{
    fetchAlerts();
  },[]);

  const fetchAlerts = async ()=>{

    const res = await API.get("/forecast/alerts/low-stock");

    setAlerts(res.data);

  };

  return(

    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        AI Low Stock Alerts
      </h1>

      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>
            <th className="p-3">Product</th>
            <th className="p-3">Stock</th>
            <th className="p-3">AI Message</th>
          </tr>

        </thead>

        <tbody>

          {alerts.map(alert=>(
            <tr key={alert.productId} className="border-b">

              <td className="p-3">{alert.productName}</td>

              <td className="p-3 text-red-600 font-bold">
                {alert.stock}
              </td>

              <td className="p-3 text-indigo-600">
                {alert.aiMessage}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  );

}

export default LowStockAlerts;