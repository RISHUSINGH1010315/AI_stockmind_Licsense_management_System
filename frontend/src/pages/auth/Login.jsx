import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Lock, Mail } from "lucide-react";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  ////////////////////////////////////////////////////////
  // LOGIN FUNCTION
  ////////////////////////////////////////////////////////

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await API.post("/auth/login", {
        email,
        password
      });

      const data = res.data;

      console.log("LOGIN RESPONSE:", data);

      ////////////////////////////////////////////////////
      // SAVE AUTH DATA
      ////////////////////////////////////////////////////

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role
        })
      );

      toast.success("Login successful");

      ////////////////////////////////////////////////////
      // ROLE BASED REDIRECT
      ////////////////////////////////////////////////////

      switch (data.role) {

        case "superadmin":
          navigate("/super-admin/dashboard");
          break;

        case "admin":
          navigate("/admin/dashboard");
          break;

        case "employee":
          navigate("/employee/dashboard");
          break;

        default:
          navigate("/");
      }

    } catch (err) {

      console.log(err);

      toast.error(
        err?.response?.data?.message || "Login failed"
      );

    }

    setLoading(false);

  };

  ////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white w-[430px] p-10 rounded-2xl shadow-xl border">

        {/* HEADER */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-black">
            Welcome Back
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Login to access your dashboard
          </p>

        </div>

        {/* FORM */}

        <form onSubmit={handleLogin} className="space-y-5">

          {/* EMAIL */}

          <div>

            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <div className="flex items-center border rounded-lg px-3 mt-1 focus-within:ring-2 focus-within:ring-indigo-500">

              <Mail size={18} className="text-gray-400" />

              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full p-3 outline-none bg-transparent text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div>

            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="flex items-center border rounded-lg px-3 mt-1 focus-within:ring-2 focus-within:ring-indigo-500">

              <Lock size={18} className="text-gray-400" />

              <input
                type="password"
                required
                placeholder="Enter your password"
                className="w-full p-3 outline-none bg-transparent text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            </div>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition shadow-md
            ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >

            {loading ? "Logging in..." : "Login"}

          </button>

        </form>

      </div>

    </div>

  );

}

export default Login;