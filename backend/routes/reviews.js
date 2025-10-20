const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const reviewsController = require("../controllers/reviewsController");

router.post("/", auth, reviewsController.addReview);

router.get("/:movieId", reviewsController.getReviewsByMovie);

router.put("/:reviewId",auth ,reviewsController.updateReview);

router.delete("/:reviewId",auth ,reviewsController.deleteReview);

module.exports = router;
