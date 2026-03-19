import {useEffect,useState} from "react";
import API from "../../api/axios";

function LicenseOverview(){

const [licenses,setLicenses] = useState([]);

//////////////////////////////////////////////////

const fetchLicenses = async()=>{

const res = await API.get("/super-admin/licenses-overview");

setLicenses(res.data);

};

useEffect(()=>{

fetchLicenses();

},[]);

//////////////////////////////////////////////////

return(

<div className="space-y-6">

<h1 className="text-3xl font-bold text-black">
License Overview
</h1>

<div className="bg-white border rounded-xl shadow-sm overflow-hidden">

<table className="w-full">

<thead className="bg-gray-50">

<tr className="text-left text-black">

<th className="p-4">User</th>
<th className="p-4">Product</th>
<th className="p-4">Expiry Date</th>
<th className="p-4">Status</th>

</tr>

</thead>

<tbody>

{licenses.map((l)=>{

const expired = new Date(l.expiry_date) < new Date();

return(

<tr key={l.id} className="border-b">

<td className="p-4 text-black">
{l.user_name}
</td>

<td className="p-4 text-black">
{l.product_name}
</td>

<td className="p-4 text-black">
{new Date(l.expiry_date).toLocaleDateString()}
</td>

<td className="p-4">

<span className={`px-3 py-1 rounded-full text-xs font-medium ${
expired
? "bg-red-100 text-red-600"
: "bg-green-100 text-green-600"
}`}>

{expired ? "Expired" : "Active"}

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

export default LicenseOverview;