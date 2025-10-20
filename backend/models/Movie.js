const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  genre: [String],
  rating: Number,
  poster: String,
  description: String,
  imdbID: String
});

module.exports = mongoose.model("Movie", movieSchema);
