import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/movies");
        setMovies(res.data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };
    fetchMovies();
  }, []);

  // Fetch watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/watchlists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(res.data.map((m) => m.movieId)); // store movieIds only
      } catch (err) {
        console.error("Error fetching watchlist:", err);
      }
    };
    fetchWatchlist();
  }, []);

  const addToWatchlist = async (movieId, title) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/watchlists",
        { movieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchlist(()=>[...watchlist, movieId]); // update state immediately
      alert(`${title} added to watchlist`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add to watchlist");
    }
  };

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `http://localhost:5000/movies?title=${encodeURIComponent(search)}`
      );

      if (res.data.length > 0) {
        setMovies(res.data);
      } else {
        const fetchRes = await axios.get(
          `http://localhost:5000/movies/fetch-imdb?title=${encodeURIComponent(search)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMovies(fetchRes.data);
      }
    } catch (err) {
      console.error("Error searching movies:", err);
      alert("Something went wrong during search.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      
      <header className="px-10 py-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
          🎬 Movie Selector
        </h1>
        <nav>
          <ul className="flex gap-6 text-gray-300 font-medium">
            <li>
              <Link to="#" className="hover:text-blue-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/watchlist" className="hover:text-blue-400">
                My Watchlist
              </Link>
            </li>
            <li>
              <Link to="/users/profile" className="hover:text-blue-400">
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      
      <div className="px-10 mb-6 flex gap-4">
        <input
          type="text"
          placeholder="🔍 Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 p-3 rounded-xl bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
        >
          Search
        </button>
      </div>

      <main className="px-10 pb-10">
        <h2 className="text-2xl font-bold mb-6">Available Movies</h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
              <div
                key={movie._id}
                className="bg-slate-900 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition"
              >
                <Link to={`/movies/${movie._id}`}>
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-64 object-cover rounded-lg hover:opacity-80 transition"
                  />
                </Link>

                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-bold">{movie.title}</h3>
                  <p className="text-sm text-gray-400">{movie.genre}</p>
                  <p className="text-sm">⭐ {movie.rating ?? "N/A"}</p>

                  {watchlist.includes(movie._id) ? (
                    <button
                      className="mt-2 px-3 py-2 bg-gray-600 rounded-lg text-white text-sm cursor-not-allowed"
                      disabled
                    >
                      ✅ In Watchlist
                    </button>
                  ) : (
                    <button
                      onClick={() => addToWatchlist(movie._id, movie.title)}
                      className="mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
                    >
                      ➕ Add to Watchlist
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </main>

    </div>
  );
}