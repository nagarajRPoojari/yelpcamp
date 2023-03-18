const { cloudinary } = require("../cloudinary");
const Campground = require("../module/camground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res, next) => {
  const campground = await Campground.find({});
  res.render("campgrounds/index.ejs", { campground });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.creatCampground = async (req, res, next) => {
  geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  const campground = new Campground(req.body.campground);
  console.log(geoData.body.features[0].geometry);
  campground.geometry = geoData.body.features[0].geometry;

  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  campground.author = req.user._id;
  await campground.save();

  req.flash("success", "Successsfully created a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!camp) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { camp });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;

  const campground = await Campground.findById(id);

  const camp = await Campground.findByIdAndUpdate(id, req.body.campground);
  const images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  camp.images.push(...images);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  await camp.save();
  req.flash("success", "successfully updated ");
  res.redirect(`/campgrounds/${req.params.id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  await Campground.findById(id).populate("reviews");
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
};
