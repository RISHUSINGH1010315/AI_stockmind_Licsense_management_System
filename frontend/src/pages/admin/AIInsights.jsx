import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function AIInsights() {

  const [data, setData] = useState({
    lowStock: [],
    topSelling: [],
    leastSelling: []
  });

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    const res = await API.get("/ai/insights");
    setData(res.data);
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">AI Inventory Insights</h1>

      {/* Low Stock */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">⚠️ Low Stock</h2>
        {data.lowStock.map((p,i)=>(
          <p key={i}>{p.name} - {p.stock}</p>
        ))}
      </div>

      {/* Top Selling */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">🔥 Top Selling</h2>
        {data.topSelling.map((p,i)=>(
          <p key={i}>{p.name} - {p.total_sold}</p>
        ))}
      </div>

      {/* Least Selling */}
      <div>
        <h2 className="text-xl font-semibold">📉 Least Selling</h2>
        {data.leastSelling.map((p,i)=>(
          <p key={i}>{p.name} - {p.total_sold}</p>
        ))}
      </div>

    </div>
  );
}