const campground = require("../MODELS/campground")
const Campground=require("../MODELS/campground")
const cloudinary=require("../cloudinary/index")
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken=process.env.MAPBOX_TOKEN
const geocoder=mbxGeocoding({accessToken:mapBoxToken})
module.exports.index=async(req,res)=>{
    const campgrounds=await Campground.find()
res.render("campgrounds/index",{campgrounds})
}
module.exports.renderNewForm=(req,res)=>{
    res.render("campgrounds/new")//always keep in mind the path camp/new or \camp/new and not /camp/new
}
module.exports.createNewCampground=async(req,res,next)=>{
    const geodata=await geocoder.forwardGeocode({query:req.body.campground.location,limit:1}).send()
const newcampground=new Campground(req.body.campground)
newcampground.geometry=geodata.body.features[0].geometry
newcampground.image=req.files.map(f=>({url:f.path,filename:f.filename}))
newcampground.author=req.user._id
    await newcampground.save()
    console.log(newcampground)
    req.flash("success","Successfully made a new campground")
    res.redirect("/campgrounds")
    }
    module.exports.showCampground=async(req,res)=>{
        const {id}=req.params
        const campground=await Campground.findById(id).populate({
            path:'review',
        populate:{
            path:"author"
        }
    })
        .populate("author")
        //console.log(campground)
        if(!campground){
            req.flash("error","CANNOT FIND THIS CAMPGROUND")
            return res.redirect("/campgrounds")
        }
        res.render("campgrounds/show",{campground})}
        module.exports.renderEditForm=async(req,res)=>{
            const {id}=req.params
                const campground= await Campground.findById(id)
               
            if(!campground){
                req.flash("error","CANNOT EDIT THIS CAMPGROUND")
               return res.redirect("/campgrounds")
            }
                
                res.render("campgrounds/edit",{campground})}
        module.exports.updateEditForm=async(req,res)=>{
            const {id}=req.params
            console.log(req.body)
            const campground=await Campground.findByIdAndUpdate(id,req.body.campground)//we can also use spread(...) keyword for req.body.campground if we want a copy a object
           const img=req.files.map(f=>({url:f.path,filename:f.filename}))
            campground.image.push(...img)
            await campground.save()
            if(req.body.deleteImages){
                for(let filename of req.body.deleteImages){
                   await cloudinary.uploader.destroy(filename)
                }
            await campground.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}})
            console.log(campground)
            }
            req.flash("success","Sucecssfully edit a new campground")
            res.redirect(`/campgrounds/${id}`)}
            module.exports.deleteForm=async(req,res)=>{
                const {id}=req.params
                await Campground.findByIdAndDelete(id)
                req.flash("success","SUCCESSFULLY DELETED A CAMPGROUND")
                res.redirect("/campgrounds")}