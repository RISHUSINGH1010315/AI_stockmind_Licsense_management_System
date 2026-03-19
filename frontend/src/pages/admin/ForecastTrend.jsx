import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function ForecastTrend(){

  const [data,setData] = useState([]);

  const productId = 1; // test product

  useEffect(()=>{
    fetchTrend();
  },[]);

  const fetchTrend = async ()=>{

    const res = await API.get(`/forecast/analytics/trend/${productId}`);

    setData(res.data);

  };

  return(

    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        AI Demand Trend
      </h1>

      <div className="bg-white border p-6 rounded-xl">

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="total_sold"
              stroke="#4f46e5"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default ForecastTrend;