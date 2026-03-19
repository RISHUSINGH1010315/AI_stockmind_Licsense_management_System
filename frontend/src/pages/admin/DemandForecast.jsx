import { useEffect, useState } from "react";
import API from "../../api/axios";

function DemandForecast(){

  const [forecast,setForecast] = useState(null);
  const productId = 1; // test product

  useEffect(()=>{
    fetchForecast();
  },[]);

  const fetchForecast = async ()=>{

    const res = await API.get(`/forecast/${productId}`);

    setForecast(res.data);

  };

  if(!forecast) return <div>Loading AI prediction...</div>;

  return(

    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        AI Demand Prediction
      </h1>

      <div className="bg-white border p-6 rounded-xl">

        <p>
          Product ID: <b>{forecast.productId}</b>
        </p>

        <p>
          Total Sold (30 days): <b>{forecast.totalSoldLast30Days}</b>
        </p>

        <p>
          Avg Daily Demand: <b>{forecast.avgDailyDemand}</b>
        </p>

        <p className="text-indigo-600 font-bold">
          Next Month Prediction: {forecast.predictedNextMonth}
        </p>

      </div>

    </div>

  );

}

export default DemandForecast;