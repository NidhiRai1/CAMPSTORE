if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./MODELS/campground");
const methodoveride = require("method-override");
const ejsMate = require("ejs-mate");
const { campgroundSchema, reviewSchema } = require("./MODELS/Schemas.js");
const catchAsync = require("./utils/catchasync");
const ExpressError = require("./utils/ExpressError");
const flash = require("connect-flash");
const Review = require("./MODELS/reviews");
const reviewrouter = require("./ROUTES/reviewrouter");
const campgroundrouter = require("./ROUTES/campgroundroute");
const userrouter = require("./ROUTES/userroute");
const session = require("express-session");
const passport = require("passport");
const localpassport = require("passport-local");
const user = require("./MODELS/user");
const helmet = require("helmet");
const mongoStore = require("connect-mongo")(session);
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";
mongoose.set("strictQuery", false);
//
mongoose
  .connect(dbUrl, {
    //useNewUrlParser: true,
    // useCreateIndex: true,
    ////// useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR!!!!");
    console.log(err);
  });
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodoveride("_method"));
app.engine("ejs", ejsMate);
app.use(flash());
//app.use(helmet({contentSecurityPolicy:false}))

app.use(express.static("public"));
//app.use(express.static(path.join(_dirname,'public')))

//middleware setup for validating review data
const secret = process.env.Secret || "Thisisnotagoodsecret";
const store = new mongoStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 3600,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});
const sessionoptions = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxage: 1000 * 60 * 60 * 24 * 7,
  },
}; //defining session options to provide a secret and use resave and save uninitialized to prevent deprewcated warning
app.use(session(sessionoptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localpassport(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentuser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  console.log("WELCOME TO YELPCAMP");
  res.render("home");
});
//in order to make a review we should know campground that it should be associated with
app.use("/campgrounds", campgroundrouter);
app.use("/campgrounds/:id/reviews", reviewrouter);
app.use("/", userrouter);
app.all("*", (req, res, next) => {
  next(new ExpressError("PAGE NOT FOUND", 404));
});
app.use(
  (err, req, res, next) => {
    const { statuscode = 500, message = "something went wrong" } = err;
    if (!err.message) err.message = "OH NO,SOMETHING WENT WRONG";
    res.status(statuscode).render("error", { err });
  } //HANDLING THE ERROR THROUGH CUSTOM MIDDLEWARE(ERROR HANDLER)
);
app.listen(3000, () => {
  console.log("SERVING FROM PORT 3000");
});
