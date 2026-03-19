import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

function RevenueDashboard() {

    const [data, setData] = useState([]);

    const fetchRevenue = async () => {

        try {

            const res = await API.get("/super-admin/revenue");

            setData(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {
        fetchRevenue();
    }, []);

    return (

        <div className="space-y-8">

            <h1 className="text-3xl font-bold text-black">
                Revenue Analytics
            </h1>

            <div className="bg-white p-6 rounded-xl shadow">

                <h2 className="text-lg font-semibold mb-4 text-black">
                    Monthly Revenue
                </h2>

                <ResponsiveContainer width="100%" height={300}>

                    <LineChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#7c3aed"
                            strokeWidth={3}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default RevenueDashboard;