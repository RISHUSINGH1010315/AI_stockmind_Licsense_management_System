import {useEffect,useState} from "react";
import API from "../../api/axios";
import {Trash} from "lucide-react";
import toast from "react-hot-toast";

function PlanManagement(){

const [plans,setPlans] = useState([]);
const [name,setName] = useState("");
const [price,setPrice] = useState("");
const [users,setUsers] = useState("");
const [duration,setDuration] = useState("");

//////////////////////////////////////////////////

const fetchPlans = async()=>{

const res = await API.get("/super-admin/plans");

setPlans(res.data);

};

useEffect(()=>{
fetchPlans();
},[]);

//////////////////////////////////////////////////

const createPlan = async()=>{

try{

await API.post("/super-admin/plans",{
name,
price,
users_limit:users,
duration
});

toast.success("Plan created");

setName("");
setPrice("");
setUsers("");
setDuration("");

fetchPlans();

}catch(err){

toast.error("Create failed");

}

};

//////////////////////////////////////////////////

const deletePlan = async(id)=>{

try{

await API.delete(`/super-admin/plans/${id}`);

toast.success("Plan deleted");

fetchPlans();

}catch(err){

toast.error("Delete failed");

}

};

//////////////////////////////////////////////////

return(

<div className="space-y-6">

<h1 className="text-3xl font-bold text-black">
Plans Management
</h1>

{/* CREATE PLAN */}

<div className="flex gap-3">

<input
placeholder="Plan name"
value={name}
onChange={(e)=>setName(e.target.value)}
className="border px-4 py-2 rounded text-black"
/>

<input
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
className="border px-4 py-2 rounded text-black"
/>

<input
placeholder="Users limit"
value={users}
onChange={(e)=>setUsers(e.target.value)}
className="border px-4 py-2 rounded text-black"
/>

<input
placeholder="Duration (days)"
value={duration}
onChange={(e)=>setDuration(e.target.value)}
className="border px-4 py-2 rounded text-black"
/>

<button
onClick={createPlan}
className="bg-purple-600 text-white px-5 rounded"
>
Create
</button>

</div>

{/* TABLE */}

<div className="bg-white border rounded-xl shadow">

<table className="w-full">

<thead className="bg-gray-50">

<tr className="text-left text-black">

<th className="p-4">Plan</th>
<th className="p-4">Price</th>
<th className="p-4">Users</th>
<th className="p-4">Duration</th>
<th className="p-4 text-right">Action</th>

</tr>

</thead>

<tbody>

{plans.map((p)=>{

return(

<tr key={p.id} className="border-b">

<td className="p-4 text-black">
{p.name}
</td>

<td className="p-4 text-black">
₹ {p.price}
</td>

<td className="p-4 text-black">
{p.users_limit}
</td>

<td className="p-4 text-black">
{p.duration} days
</td>

<td className="p-4 text-right">

<button
onClick={()=>deletePlan(p.id)}
className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-2 ml-auto"
>

<Trash size={14}/>
Delete

</button>

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

export default PlanManagement;