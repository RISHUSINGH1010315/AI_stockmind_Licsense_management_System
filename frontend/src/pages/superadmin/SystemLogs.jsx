import {useEffect,useState} from "react";
import API from "../../api/axios";

function SystemLogs(){

const [logs,setLogs] = useState([]);

//////////////////////////////////////////////////

const fetchLogs = async()=>{

const res = await API.get("/super-admin/logs");

setLogs(res.data);

};

useEffect(()=>{

fetchLogs();

},[]);

//////////////////////////////////////////////////

return(

<div className="space-y-6">

<h1 className="text-3xl font-bold text-black">
System Activity Logs
</h1>

<div className="bg-white border rounded-xl shadow-sm overflow-hidden">

<table className="w-full">

<thead className="bg-gray-50">

<tr className="text-left text-black">

<th className="p-4">Action</th>
<th className="p-4">User</th>
<th className="p-4">Time</th>

</tr>

</thead>

<tbody>

{logs.map((log)=>{

return(

<tr key={log.id} className="border-b">

<td className="p-4 text-black">
{log.action}
</td>

<td className="p-4 text-black">
{log.user_name}
</td>

<td className="p-4 text-black">
{new Date(log.created_at).toLocaleString()}
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

export default SystemLogs;