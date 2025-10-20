import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Watchlist() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchWatchlist = async () => {
      try {
        const res = await axios.get("http://localhost:5000/watchlists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMovies(res.data);
      } catch (err) {
        console.error("Error fetching watchlist:", err);
      }
    };

    fetchWatchlist();
  }, [navigate]);

  const removeMovie = async (movieId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/watchlists/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies(movies.filter((m) => m.movieId !== movieId));
    } catch (err) {
      console.error("Error removing movie:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-10">
      <h2 className="text-2xl font-bold mb-6">🎥 My Watchlist</h2>
      {movies.length === 0 ? (
        <p className="text-gray-400">Your watchlist is empty.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
            <div
              key={movie.movieId}
              className="bg-slate-900 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-bold">{movie.title}</h3>
                <button
                  onClick={() => removeMovie(movie.movieId)}
                  className="mt-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm"
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
