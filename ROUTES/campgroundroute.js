const express = require("express");
const router = express.Router();
//since we are nested in RoUTES folder we have to move out one step back
const catchAsync = require("../utils/catchasync");
const Campground = require("../MODELS/campground");
const campgroundcontroller = require("../controller/campground");
const Review = require("../MODELS/reviews");
const { campgroundSchema, reviewSchema } = require("../MODELS/Schemas.js");
const {
  isLoggedin,
  validmiddleware,
  isAuthor,
} = require("../loginrouteprotector_middleware");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });
router.get("/", catchAsync(campgroundcontroller.index));
router.get("/new", isLoggedin, campgroundcontroller.renderNewForm);
router.post(
  "/",
  isLoggedin,
  upload.array("image"),
  validmiddleware,
  catchAsync(campgroundcontroller.createNewCampground)
);
router.get("/:id", catchAsync(campgroundcontroller.showCampground));
router.get(
  "/:id/edit",
  isLoggedin,
  isAuthor,
  catchAsync(campgroundcontroller.renderEditForm)
);
router.delete(
  "/:id",
  isLoggedin,
  isAuthor,
  catchAsync(campgroundcontroller.deleteForm)
);
router.put(
  "/:id",
  isLoggedin,
  isAuthor,
  upload.array("image"),
  validmiddleware,
  catchAsync(campgroundcontroller.updateEditForm)
);
//in order to make a review we should know campground that it should be associated with
module.exports = router;
