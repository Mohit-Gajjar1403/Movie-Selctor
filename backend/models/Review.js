const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewText: String
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
