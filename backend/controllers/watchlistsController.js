const Watchlist = require("../models/Watchlist");
const Movie = require("../models/Movie");

exports.addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    let watchlist = await Watchlist.findOne({ user: req.user.id });

    if (!watchlist) {
      // Create a new watchlist for the user
      watchlist = new Watchlist({
        user: req.user.id,
        movies: [{
          movieId: movie._id.toString(),
          title: movie.title,
          poster: movie.poster
        }]
      });
    } else {
      // Check if movie already exists in watchlist
      const alreadyExists = watchlist.movies.some(m => m.movieId === movie._id.toString());
      if (alreadyExists) {
        return res.status(400).json({ error: "Movie already in watchlist" });
      }

      watchlist.movies.push({
        movieId: movie._id.toString(),
        title: movie.title,
        poster: movie.poster
      });
    }

    await watchlist.save();
    res.status(201).json({ message: "Movie added to watchlist", data: watchlist });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ user: req.user.id });
    res.json(watchlist ? watchlist.movies : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.removeFromWatchlist = async (req, res) => {
   try {
    const { movieId } = req.params;

    const watchlist = await Watchlist.findOne({ user: req.user.id });
    if (!watchlist) {
      return res.status(404).json({ error: "Watchlist not found" });
    }

    const before = watchlist.movies.length;
    watchlist.movies = watchlist.movies.filter(m => m.movieId !== movieId);

    if (before === watchlist.movies.length) {
      return res.status(404).json({ error: "Movie not found in watchlist" });
    }

    await watchlist.save();
    res.json({ message: "Movie removed from watchlist", data: watchlist.movies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};