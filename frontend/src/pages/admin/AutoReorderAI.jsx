import { useEffect, useState } from "react";
import API from "../../api/axios";

function AutoReorderAI(){

  const [data,setData] = useState([]);

  useEffect(()=>{
    fetchAI();
  },[]);

  const fetchAI = async ()=>{

    const res = await API.get("/forecast/ai/reorder");

    setData(res.data);

  };

  return(

    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        AI Auto Reorder Suggestions
      </h1>

      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>
            <th className="p-3">Product</th>
            <th className="p-3">Current Stock</th>
            <th className="p-3">Predicted Demand</th>
            <th className="p-3">AI Suggest Order</th>
          </tr>

        </thead>

        <tbody>

          {data.map(item=>(
            <tr key={item.productId} className="border-b">

              <td className="p-3">{item.productName}</td>

              <td className="p-3">{item.stock}</td>

              <td className="p-3">{item.predictedNextMonth}</td>

              <td className="p-3 text-indigo-600 font-bold">
                {item.reorderSuggestion}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  );

}

export default AutoReorderAI;