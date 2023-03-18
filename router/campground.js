const express = require("express");
const router = express.Router({ mergeParams: true });
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utilities/catchAsync");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const { isloggedin, isAuthor, validateCampground } = require("../middlewares");
router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isloggedin,
    upload.array("image"),
    validateCampground,
    campgrounds.creatCampground
  );

router.get("/new", isloggedin, campgrounds.renderNewForm);
router.get("/:id", isloggedin, catchAsync(campgrounds.showCampground));
router.get("/:id/edit", isloggedin, isAuthor, campgrounds.renderEditForm);

module.exports = router;
