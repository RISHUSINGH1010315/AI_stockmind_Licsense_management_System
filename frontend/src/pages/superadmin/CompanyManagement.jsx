import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Trash, Search, Building } from "lucide-react";
import toast from "react-hot-toast";

function CompanyManagement() {

  const [companies,setCompanies] = useState([]);
  const [filtered,setFiltered] = useState([]);
  const [plans,setPlans] = useState([]);

  const [name,setName] = useState("");
  const [search,setSearch] = useState("");

  ////////////////////////////////////////////////////////
  // FETCH COMPANIES
  ////////////////////////////////////////////////////////

  const fetchCompanies = async()=>{

    try{

      const res = await API.get("/super-admin/companies");

      setCompanies(res.data);
      setFiltered(res.data);

    }catch(err){

      toast.error("Failed to load companies");

    }

  };

  ////////////////////////////////////////////////////////
  // FETCH PLANS
  ////////////////////////////////////////////////////////

  const fetchPlans = async()=>{

    try{

      const res = await API.get("/super-admin/plans");

      setPlans(res.data);

    }catch(err){

      console.log(err);

    }

  };

  useEffect(()=>{

    fetchCompanies();
    fetchPlans();

  },[]);

  ////////////////////////////////////////////////////////
  // SEARCH
  ////////////////////////////////////////////////////////

  useEffect(()=>{

    const result = companies.filter((c)=>
      (c.name || "").toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(result);

  },[search,companies]);

  ////////////////////////////////////////////////////////
  // CREATE COMPANY
  ////////////////////////////////////////////////////////

  const createCompany = async()=>{

    if(!name.trim()){
      toast.error("Enter company name");
      return;
    }

    try{

      await API.post("/super-admin/companies",{name});

      toast.success("Company created");

      setName("");

      fetchCompanies();

    }catch(err){

      toast.error("Create failed");

    }

  };

  ////////////////////////////////////////////////////////
  // DELETE COMPANY
  ////////////////////////////////////////////////////////

  const deleteCompany = async(id)=>{

    try{

      await API.delete(`/super-admin/companies/${id}`);

      toast.success("Company deleted");

      fetchCompanies();

    }catch(err){

      toast.error("Delete failed");

    }

  };

  ////////////////////////////////////////////////////////
  // ASSIGN PLAN
  ////////////////////////////////////////////////////////

  const assignPlan = async(companyId,planId)=>{

    try{

      await API.post("/super-admin/assign-plan",{
        companyId,
        planId
      });

      toast.success("Plan assigned");

      fetchCompanies();

    }catch(err){

      toast.error("Assign failed");

    }

  };

  ////////////////////////////////////////////////////////

  return(

    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-black">
          Company Management
        </h1>

        <p className="text-black">
          Manage all companies on the platform
        </p>

      </div>


      {/* CREATE COMPANY */}

      <div className="flex gap-3">

        <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
          placeholder="Company name"
          className="border px-4 py-2 rounded-lg text-black w-72"
        />

        <button
          onClick={createCompany}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
        >
          Create
        </button>

      </div>


      {/* SEARCH */}

      <div className="relative w-80">

        <Search
          size={18}
          className="absolute left-3 top-2.5 text-gray-400"
        />

        <input
          placeholder="Search company..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border rounded-lg pl-10 pr-4 py-2 w-full text-black"
        />

      </div>


      {/* TABLE */}

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr className="text-left text-black">

              <th className="p-4">Company</th>
              <th className="p-4">Plan</th>
              <th className="p-4">Created</th>
              <th className="p-4">Assign Plan</th>
              <th className="p-4 text-right">Action</th>

            </tr>

          </thead>

          <tbody>

            {filtered.length === 0 ? (

              <tr>

                <td colSpan="5" className="p-8 text-center text-black">

                  No companies found

                </td>

              </tr>

            ):(

              filtered.map((c)=>{

                return(

                  <tr
                    key={c.id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="p-4 flex items-center gap-3 text-black">

                      <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">

                        <Building size={18}/>

                      </div>

                      {c.name}

                    </td>

                    <td className="p-4 text-black">

                      {c.plan || "No Plan"}

                    </td>

                    <td className="p-4 text-black">

                      {c.created_at
                        ? new Date(c.created_at).toLocaleDateString()
                        : "-"
                      }

                    </td>

                    {/* PLAN DROPDOWN */}

                    <td className="p-4">

                      <select
                        className="border px-3 py-2 rounded text-black"
                        onChange={(e)=>assignPlan(c.id,e.target.value)}
                      >

                        <option>Select Plan</option>

                        {plans.map((p)=>(
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}

                      </select>

                    </td>

                    <td className="p-4 text-right">

                      <button
                        onClick={()=>deleteCompany(c.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-2 ml-auto"
                      >

                        <Trash size={14}/>
                        Delete

                      </button>

                    </td>

                  </tr>

                )

              })

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default CompanyManagement;