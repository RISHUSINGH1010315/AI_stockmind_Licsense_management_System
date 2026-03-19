import { useEffect, useState } from "react";
import API from "../../api/axios";

function Subscriptions(){

const [subs,setSubs] = useState([]);

const fetchSubscriptions = async()=>{

const res = await API.get("/subscription/all");

setSubs(res.data);

};

useEffect(()=>{
fetchSubscriptions();
},[]);

return(

<div className="space-y-6">

<h1 className="text-3xl font-bold text-black">
Subscriptions
</h1>

<div className="bg-white border rounded-xl shadow-sm overflow-hidden">

<table className="w-full">

<thead className="bg-gray-50">

<tr className="text-left text-black">

<th className="p-4">Company</th>
<th className="p-4">Plan</th>
<th className="p-4">Start Date</th>
<th className="p-4">Expiry</th>
<th className="p-4">Status</th>

</tr>

</thead>

<tbody>

{subs.map((s)=>{

return(

<tr key={s.id} className="border-b hover:bg-gray-50">

<td className="p-4 text-black">
{s.company}
</td>

<td className="p-4 text-black">
{s.plan}
</td>

<td className="p-4 text-black">
{new Date(s.start_date).toLocaleDateString()}
</td>

<td className="p-4 text-black">
{new Date(s.expiry_date).toLocaleDateString()}
</td>

<td className="p-4">

<span className={`px-3 py-1 rounded-full text-xs font-medium
${s.status === "active"
? "bg-green-100 text-green-700"
: "bg-red-100 text-red-600"}`}>

{s.status}

</span>

</td>

</tr>

)

})}

</tbody>

</table>

</div>

</div>

)

}

export default Subscriptions;