const express = require("express");
const router = express.Router();
const usersController=require('../controllers/watchlistsController');
const auth = require("../middleware/auth");
router.post("/",auth, usersController.addToWatchlist);
router.get("/",auth, usersController.getWatchlist);
router.delete("/:movieId",auth,usersController.removeFromWatchlist);
module.exports = router;
