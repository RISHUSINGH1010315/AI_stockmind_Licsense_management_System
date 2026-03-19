import { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

function CreateAdmin() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{

      const res = await API.post("/super-admin/create-admin",{
        name,
        email,
        password
      });

      toast.success("Admin created successfully");

      setName("");
      setEmail("");
      setPassword("");

    }catch(err){

      toast.error(err?.response?.data?.message || "Error");

    }

  };

  return(

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Create Admin
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

        <input
          type="text"
          placeholder="Admin Name"
          className="w-full border p-3 rounded"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full border p-3 rounded"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded"
        >
          Create Admin
        </button>

      </form>

    </div>

  );
}

export default CreateAdmin;