import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

function CompanyDetails(){

const {id} = useParams();

const [company,setCompany] = useState({});
const [employees,setEmployees] = useState([]);

//////////////////////////////////////////////////

const fetchCompany = async()=>{

const res = await API.get(`/super-admin/company/${id}`);

setCompany(res.data.company);
setEmployees(res.data.employees);

};

useEffect(()=>{
fetchCompany();
},[]);

//////////////////////////////////////////////////

return(

<div className="space-y-6">

<h1 className="text-3xl font-bold text-black">
{company.name}
</h1>

<div className="grid grid-cols-3 gap-6">

<Card title="Admin" value={company.admin_name}/>
<Card title="Employees" value={employees.length}/>
<Card title="Created" value={
company.created_at
? new Date(company.created_at).toLocaleDateString()
: "-"
}/>

</div>

{/* EMPLOYEE TABLE */}

<div className="bg-white border rounded-xl shadow-sm">

<table className="w-full">

<thead className="bg-gray-50">

<tr className="text-left text-black">

<th className="p-4">Employee</th>
<th className="p-4">Email</th>

</tr>

</thead>

<tbody>

{employees.map((e)=>{

return(

<tr key={e.id} className="border-b">

<td className="p-4 text-black">
{e.name}
</td>

<td className="p-4 text-black">
{e.email}
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

function Card({title,value}){

return(

<div className="bg-white border rounded-xl p-6 shadow-sm">

<p className="text-gray-500 text-sm">
{title}
</p>

<h2 className="text-2xl font-bold text-black">
{value || 0}
</h2>

</div>

)

}

export default CompanyDetails;