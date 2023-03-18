const Campground = require("./module/camground");
const Review = require("./module/reviews");
const { CampgroundSchema, ReviewSchema } = require("./schemas");
const ExpressError = require("./utilities/ExpressError");

module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Sign in first");
    return res.redirect("/login");
  }
  next();
};

//passport
module.exports.validateCampground = (req, res, next) => {
  const { error } = CampgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = ReviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "you dont have parmission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "you dont have parmission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
