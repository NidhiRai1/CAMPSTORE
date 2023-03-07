const mongoose=require("mongoose")
const Schema=mongoose.Schema//we will use this as a shortcut for mongoose.schema
const Review=require("./reviews")
const opts={toJSON:{virtuals:true}}
const CampgroundSchema=new Schema({
    description:String,
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    image:[
        {
        url:String,
        filename:String
        }
    ],
    price:Number,
    location:String,
    describe:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    review:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }]
},opts)
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.description}</a></strong>
    <p>${this.describe.substring(0,30)}...</p>`
})
module.exports=mongoose.model("Campground",CampgroundSchema)//making a new model and exporting at the same time
//since we are going to have many reviews in campground model there will be
// a one to many relationship between campground and reviews .
//therefore we make a review array of object ids of each review in each campground