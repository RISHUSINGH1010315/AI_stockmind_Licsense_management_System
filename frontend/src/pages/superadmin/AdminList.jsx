import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminList({ admins }) {

  const navigate = useNavigate();

  const loginAsAdmin = async (id) => {

    try {

      const res = await API.post(`/auth/impersonate/${id}`);

      localStorage.setItem("token", res.data.token);

      navigate("/admin-dashboard");

    } catch (err) {
      alert("Error logging in as admin");
    }
  };

  return (
    <div>
      <h2>All Admins</h2>

      {admins.map((admin) => (
        <div key={admin.id}>

          <span>{admin.name}</span>

          <button
            onClick={() => loginAsAdmin(admin.id)}
            className="bg-blue-500 text-white px-3 py-1 ml-3"
          >
            Login as Admin
          </button>

        </div>
      ))}

    </div>
  );
}