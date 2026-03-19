import {useEffect,useState} from "react";
import API from "../../api/axios";

function PlatformAnalytics(){

const [stats,setStats] = useState({});

const fetchStats = async()=>{

const res = await API.get("/super-admin/platform-stats");

setStats(res.data);

};

useEffect(()=>{
fetchStats();
},[]);

return(

<div className="space-y-6">

<h1 className="text-3xl font-bold text-black">
Platform Analytics
</h1>

<div className="grid grid-cols-3 gap-6">

<Card title="Companies" value={stats.companies}/>
<Card title="Admins" value={stats.admins}/>
<Card title="Employees" value={stats.employees}/>
<Card title="Licenses" value={stats.licenses}/>
<Card title="Expiring Licenses" value={stats.expiring}/>

</div>

</div>

)

}

function Card({title,value}){

return(

<div className="bg-white p-6 rounded-xl shadow border">

<p className="text-gray-500 text-sm">{title}</p>

<h2 className="text-2xl font-bold text-black">
{value || 0}
</h2>

</div>

)

}

export default PlatformAnalytics;