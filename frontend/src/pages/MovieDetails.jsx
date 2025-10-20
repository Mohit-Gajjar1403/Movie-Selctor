import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReviewText, setEditingReviewText] = useState("");
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error("Error fetching movie:", err);
        setError("Failed to load movie details");
      }
    };
    fetchMovie();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/reviews/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [id]);

  // Add review
    const handleAddReview = async () => {
      if (!newReview.trim()) return;

      try {
        const res = await axios.post(
          "http://localhost:5000/reviews",
          { movieId: id, reviewText: newReview },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Review added successfully:", res.data);

        setNewReview("");
        const updatedReviews = await axios.get(`http://localhost:5000/reviews/${id}`);
        setReviews(updatedReviews.data);

      } catch (err) {
        console.error("Error adding review:", err.response ? err.response.data : err.message);
        alert(err.response?.data?.msg || "Failed to add review");
      }
    };

  // Update review
  const handleUpdateReview = async (reviewId) => {
    if (!editingReviewText.trim() || !reviewId) return;

    try {
      await axios.put(
        `http://localhost:5000/reviews/${reviewId}`,
        { reviewText: editingReviewText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    
      setEditingReviewId(null);
      setEditingReviewText("");
      const res = await axios.get(`http://localhost:5000/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!reviewId) {
      console.error("Cannot delete review: Invalid review ID");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  if (!movie)
    return <div className="text-white p-10">Loading movie details...</div>;

  if (error)
    return <div className="text-red-500 p-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-6">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg"
      >
        ⬅ Back
      </button>

      <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl shadow-lg overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-96 object-cover"
        />
        <div className="p-6 space-y-3">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="text-gray-400">{movie.genre}</p>
          <p>⭐ {movie.rating ?? "N/A"}</p>
          <p className="mt-2 text-gray-300">{movie.description}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-10 bg-slate-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write a review..."
            className="flex-1 p-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddReview}
            disabled={!newReview.trim()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
          >
            ➕ Add
          </button>
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet. Be the first!</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r) => {
              console.log("Review Item:", r); 
              const reviewId = r._id  ; 
              return (
                <li
                  key={reviewId}
                  className="bg-slate-700 p-4 rounded-lg flex justify-between items-center"
                >
                  {editingReviewId === reviewId ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editingReviewText}
                        onChange={(e) => setEditingReviewText(e.target.value)}
                        className="flex-1 p-2 rounded-lg bg-slate-600 text-white"
                      />
                      <button
                        onClick={() => handleUpdateReview(reviewId)}
                        disabled={!editingReviewText.trim()}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingReviewId(null);
                          setEditingReviewText("");
                        }}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{r.reviewText}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingReviewId(reviewId);
                            setEditingReviewText(r.reviewText);
                          }}
                          className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-lg"
                        >
                          ✏ Edit
                        </button>
                        <button
                          onClick={() =>{
                            console.log("Deleting review ID:", r._id);
                           handleDeleteReview(reviewId)}
                          }
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
