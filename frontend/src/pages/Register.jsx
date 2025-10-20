import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/users/register", {
        username,
        password,
      });
      navigate("/login"); 
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-emerald-900 to-black">
      <div className="bg-black/70 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-96 border border-emerald-800">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Create Account</h2>
        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-xl bg-emerald-950 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-emerald-950 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:opacity-90 text-white font-semibold py-3 rounded-xl transition"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
