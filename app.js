if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const { urlencoded } = require("express");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utilities/catchAsync");
const ExpressError = require("./utilities/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const campgrounds = require("./controllers/campgrounds");
const reviews = require("./controllers/reviews");
const sslRedirect = require("heroku-ssl-redirect");

const multer = require("multer");
const { storage } = require("./cloudinary");
const upload = multer({ storage });

const MongoDBStore = require("connect-mongo");
const secret = process.env.SECRET || "thisistopmostsecrete";

const dbUrl = process.env.DB_URL;

mongoose.set("strictQuery", false);
const MongoStore = require("connect-mongo")(session);

const {
  isloggedin,
  validateCampground,
  isAuthor,
  isReviewAuthor,
} = require("./middlewares");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./module/user");

app.use(express.static(path.join(__dirname, "public")));

//session

const store = new MongoStore({
  url: dbUrl,
  secret: "ooops",
  touchAfter: 24 * 60 * 60,
});

store.on("error", (err) => {
  console.log("mongo store errro " + err);
});

const sessionConfig = {
  store,
  secret: "omg",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 10000 * 60 * 60 * 60,
    maxAge: 10000 * 60 * 60 * 60,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(urlencoded({ extended: true }));

const userRoutes = require("./router/users");
const campgroundRoutes = require("./router/campground");
const reviewRoutes = require("./router/review");

app.get("/", (req, res) => {
  res.render("campgrounds/home.ejs");
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

//"mongodb://127.0.0.1:27017/yelp-camp"
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
});

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {});

app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  isloggedin,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

app.put(
  "/campgrounds/:id",
  isloggedin,
  isAuthor,
  upload.array("image"),
  catchAsync(campgrounds.updateCampground)
);

app.get("/home", (req, res) => {
  res.render("campgrounds/home");
});

app.delete(
  "/campgrounds/:id",
  isloggedin,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

app.all("*", (req, res, next) => {
  next(new ExpressError("PAGE NOT FOUND!!!!", 404));
});

//error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "oh No,Something went wrong";
  res.status(statusCode).render("error", { err });

  next();
});

const port = process.env.PORT || 3000;
app.get("/campground/home", (req, res) => {
  res.render("campgrounds/new");
});

app.listen(port, () => {
  console.log("listening to " + port);
});
