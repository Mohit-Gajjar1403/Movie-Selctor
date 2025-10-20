const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { fetchAndStoreMovies,getMovies,deleteMovie,getMovieById } = require("../controllers/moviesController");


router.get("/fetch-imdb", fetchAndStoreMovies);

router.get("/",getMovies);

router.get('/:id',getMovieById);

router.delete("/:movieId",auth,deleteMovie);
module.exports = router;
