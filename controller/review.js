const Campground=require("../MODELS/campground")
const Review = require("../MODELS/reviews")
module.exports.postReview=async(req,res)=>{
    const {id}=req.params
    const newreview=new Review(req.body.Review)
    newreview.author=req.user._id
   const campground=await Campground.findById(id)
   campground.review.push(newreview)
   await newreview.save()
   await campground.save()
   req.flash("success","SUCCESSFULLY ADDED A REVIEW")
   res.redirect(`/campgrounds/${campground.id}`)
}
module.exports.deleteReview=async(req,res)=>{
    const {id,reviewid}=req.params
    await Campground.findByIdAndUpdate(id,{$pull:{review:reviewid}})
    await Review.findByIdAndDelete(reviewid)
    req.flash("success","SUCCESSFULLY DELETED A REVIEW")
    res.redirect(`/campgrounds/${id}`)}