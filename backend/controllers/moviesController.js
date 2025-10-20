const axios = require("axios");
const Movie = require("../models/Movie");

async function fetchAndStoreMovies(req, res) {
  try {
    const searchTerm = req.query.title || "Avengers";

    const searchResponse = await axios.get(
      `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie`
    );

    if (!searchResponse.data.Search) {
      return res.status(404).json({ msg: "No movies found" });
    }
    const moviePromises = searchResponse.data.Search.map(async (m) => {
      const detailResponse = await axios.get(
        `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${m.imdbID}`
      );
      const details = detailResponse.data;

      return {
        title: details.Title,
        year: parseInt(details.Year),
        genre: details.Genre.split(", ").filter(Boolean),
        rating:details.imdbRating,
        poster:details.Poster,
        description: details.Plot,
        imdbID: details.imdbID
    };
    });

    const movies = await Promise.all(moviePromises);
    await Movie.insertMany(movies);

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function getMovies(req, res) {
  const searchTerm = req.query.title || "";
  try {
    const movies = await Movie.find({
      title: { $regex: searchTerm, $options: "i" },
    });

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMovieById(req, res) {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
async function deleteMovie(req,res){
  try{
    const {movieId}=req.params;
    const movie=await Movie.findById(movieId);
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: "Not authorized" });
    }
    if(!movie)
      return res.status(404).json({ msg: "Movie not found" });
    await movie.deleteOne();
    res.status(200).json({
      msg:"movie deleted successfully"});
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
}
module.exports = { fetchAndStoreMovies,getMovies,deleteMovie,getMovieById };