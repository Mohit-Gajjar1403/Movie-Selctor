const Review = require("../models/Review");
const Movie = require("../models/Movie");
const mongoose=require('mongoose');
exports.addReview = async (req, res) => {
  try {
    const { movieId, reviewText } = req.body;
    const userId = req.user.id;

    if (!movieId || !reviewText) {
      return res.status(400).json({ msg: "Movie ID and review text are required" });
    }

    const existingReview = await Review.findOne({ movieId, userId });
    if (existingReview) {
      return res.status(400).json({ msg: "You have already reviewed this movie" });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ msg: "Movie not found" });
    }

    const review = new Review({ movieId, userId, reviewText });
    await review.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviewsByMovie = async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate("userId", "username")
      .sort({ createdAt: -1 })

    const formattedReviews = reviews.map(r => ({
  _id:r._id,
  userId: r.userId._id,
  username: r.userId.username,
  reviewText: r.userId.username + " : " + r.reviewText,
  createdAt: new Date(r.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata"
  })
}));

    res.json(formattedReviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReview=async (req, res) =>{
   try {
    const { reviewId } = req.params;

    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ msg: "Invalid or missing review ID" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await review.deleteOne();
    res.status(200).json({ msg: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
}

exports.updateReview= async(req, res)=>{
  try {
    const { reviewId } = req.params;
    const { reviewText } = req.body;

    if (!reviewText || reviewText.trim() === "") {
      return res.status(400).json({ msg: "Review text is required" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: "Not authorized" });
    }

    review.reviewText = reviewText;
    review.updatedAt = Date.now();

    await review.save();

    res.status(200).json({ msg: "Review updated successfully", review });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
}