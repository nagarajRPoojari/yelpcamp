const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const reviews = require("../controllers/reviews");
const {
  validateReview,
  isloggedin,
  isReviewAuthor,
} = require("../middlewares");

router.post("/", isloggedin, catchAsync(reviews.creatReview));

module.exports = router;
