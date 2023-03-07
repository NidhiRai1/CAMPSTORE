const express=require("express")
const router=express.Router({mergeParams:true})//WE ARE USING MERGEPARAMS:TRUE BECAUSE WE WANT TO ACCESS ID FROM THE PREFIX ROUTE SET IN APP.JS
const Campground=require("../MODELS/campground")
//const Campground=require("./MODELS/campground")
const {campgroundSchema,reviewSchema}=require("../MODELS/Schemas.js")
const catchAsync=require("../utils/catchasync")
const ExpressError=require("../utils/ExpressError")
const Review = require("../MODELS/reviews")
const reviewcontroller=require("../controller/review")
const {isLoggedin,validmiddleware,isAuthor,validateReview,isReviewAuthor}=require("../loginrouteprotector_middleware")
router.post("/",isLoggedin,validateReview,catchAsync(reviewcontroller.postReview))
router.delete("/:reviewid",isLoggedin,isReviewAuthor,catchAsync(reviewcontroller.deleteReview))
module.exports=router