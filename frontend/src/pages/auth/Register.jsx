import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Account Created 🎉");
      navigate("/");
    } catch (error) {
      alert("Registration Failed ❌");
    }
  };

  return (
    <div className="bg">
      <div className="card">
        <h1 className="title">Create Account</h1>
        <p className="subtitle">Join StockMind AI</p>

        <form onSubmit={handleRegister}>
          <input
            className="input"
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="input"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            className="input"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="loginBtn">Register</button>
        </form>

        <p className="registerText">Already have an account?</p>
        <button className="registerBtn" onClick={() => navigate("/")}>
          Back to Login
        </button>
      </div>

      <div className="blob one"></div>
      <div className="blob two"></div>
    </div>
  );
}

export default Register;
