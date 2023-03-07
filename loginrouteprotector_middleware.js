const ExpressError=require("./utils/ExpressError")
const {campgroundSchema,reviewSchema}=require("./MODELS/Schemas.js")
const Campground=require("./MODELS/campground")
const catchAsync=require("./utils/catchasync")
const Review = require("./MODELS/reviews")
module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl
        req.flash("error","YOU MUST BE LOGGED IN")
        return res.redirect("/login")
    }
    next()
}
module.exports.validmiddleware=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body)//middleware setup for validating campground data
    if(error){
       const message=error.details.map(el=>el.message).join(',')
       throw new ExpressError(message,404);
    }
    else{
        next();
    } 
    }
    module.exports.isAuthor=catchAsync(async(req,res,next)=>{
        const {id}=req.params
            const camp=await Campground.findById(id)
            if(!camp.author.equals(req.user._id)){
                req.flash("error","YOU DO NOT HAVE ACCESS TO PERFORM THIS ACTION")
               return res.redirect(`/campgrounds/${id}`)
            }
            next()
    })
    module.exports.validateReview=(req,res,next)=>{
        const {error}=reviewSchema.validate(req.body)
        if(error){
        const message=error.details.map(el=>el.message).join(',')
        throw new ExpressError(message,404)
    }
    else{
        next()
    }
    }
    module.exports.isReviewAuthor=catchAsync(async(req,res,next)=>{
        const {reviewid,id}=req.params
        const review=await Review.findById(reviewid)
        if(!review.author.equals(req.user._id)){
            req.flash("error","YOU DO NOT HAVE ACCESS TO PERFORM THIS ACTION")
               return res.redirect(`/campgrounds/${id}`)
        }
        next()
    })