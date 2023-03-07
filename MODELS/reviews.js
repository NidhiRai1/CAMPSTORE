const mongoose =require("mongoose")
const Schema=mongoose.Schema
const reviewSchema=new Schema({
    body:String,
    rating:Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})
const Review=mongoose.model("Review",reviewSchema)
module.exports=Review
//since we are going to have many reviews in campground model there will be
// a one to many relationship between campground and reviews .
//therefore we make a review array of object ids of each review in each campground