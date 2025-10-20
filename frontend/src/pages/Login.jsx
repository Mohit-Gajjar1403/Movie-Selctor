import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/users/login", {
        username,
        password
      });
      localStorage.setItem("token",res.data.token);
      navigate("/"); 
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="bg-slate-900/70 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-96 border border-slate-700">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Sign In</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-90 text-white font-semibold py-3 rounded-xl transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-300 mt-6">
          Haven’t registered yet?{" "}
          <Link to="/register" className="text-blue-400 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}