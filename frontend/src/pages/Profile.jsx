import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) return <div className="text-white p-10">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4">👤 User Profile</h2>
        <p><span className="font-semibold">Username:</span> {user.username}</p>
        <p><span className="font-semibold">Role:</span> {user.role}</p>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="mt-6 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
