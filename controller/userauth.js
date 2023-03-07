const user = require("../MODELS/user")
module.exports.renderRegister=(req,res)=>{
    res.render("users/register")
}
module.exports.postRegister=async(req,res,next)=>{
    try{
    const {email,username,password}=req.body
    const newuser=new user({email,username})
    const registereduser=await user.register(newuser,password)//we have to login and register at the same time .
    req.login(registereduser,err=>{//req.login()accepts a call back function 
        if(err){
            return next(err)
        }
        req.flash("success","WELCOME TO YELP CAMP")
        res.redirect("/campgrounds")
    })
    }
    catch(err){//error is coming from pasport local mongosoe will be handled through try and catche .e.g:error including same unique name.rest all errors will be haqndled through catchasync
        req.flash("error",err.message)
        res.redirect("/register")
    }
}
module.exports.renderLogin=(req,res)=>{
    res.render("users/login")
}
module.exports.postLogin=(req,res)=>{
    const redirectUrl=req.session.returnTo||"/campgrounds"
    delete req.session.returnTo
    req.flash("success","WELCOME BACK")
    res.redirect(redirectUrl)}

    module.exports.logout=(req,res,next)=>{
        req.logout(function(err){//req.logout now requires a  call back function therfore it accepts a function with a error as aa argument which invokes the eror handling middleware if there is an error
            if(err){
              return next(err)
            }
    
        req.flash("success","GOOD BYE..")
        res.redirect("/campgrounds")
    })
    }