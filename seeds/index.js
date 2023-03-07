//FILE TO CONNECT TO DATABASE AND USE MODEL AND MAKE CHANGES IN DATABASE INDEPENDENTLY....
//WE WILL RUN THIS FILE INDEPENDENTLY FROM NODE AND MAKE CHANGES TO OUR DATABASE//SEEDING OUR DATABASE INDEPENDENTLY FROM THIS FILE
const mongoose=require("mongoose")
const cities=require("./cities")
const {places,descriptors}=require("./seedHelpers")
const Campground=require("../MODELS/campground")
mongoose.set('strictQuery',true)
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => {
    console.log("CONNECTION OPEN!!!")
})
.catch(err => {
    console.log("OH NO ERROR!!!!")
    console.log(err)
})
const seedDb=async()=>{
    await Campground.deleteMany()
    for(let i=0;i<300;i++){
        const random1000=Math.floor(Math.random()*1000)
        const camp=new Campground({author:"63d68779d2ab893844ebcfa8",location:`${cities[random1000].city},${cities[random1000].state}`,description:`${places[Math.floor(Math.random()*places.length)]},${descriptors[Math.floor(Math.random()*descriptors.length)]}`, 
         describe:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam eveniet maxime dicta sapiente neque explicabo est temporibus similique voluptatibus necessitatibus voluptatem repellat odio, quos maiores oumenda quos autem vitae blanditiis, provident earum dolorem. Blanditiis, enim quos! Sunt vel voluptatibus eaque adipisci necessitatibus, nobis quo doloremque corrupti explicabo? Voluptatem, iure?",
       price:Math.floor(Math.random()*20)+10,
       geometry: { type: 'Point', coordinates: [cities[random1000].longitude,cities[random1000].latitude]},
       image: [
        {
          url: 'https://res.cloudinary.com/dfwn6wjpw/image/upload/v1675568492/YELPCAMP/fo8rseqzbe6ujfcpbjun.jpg',
          filename: 'YELPCAMP/fo8rseqzbe6ujfcpbjun'
        },
        {
          url: 'https://res.cloudinary.com/dfwn6wjpw/image/upload/v1675568495/YELPCAMP/bhycoshviwxrsut6p6jy.jpg',
          filename: 'YELPCAMP/bhycoshviwxrsut6p6jy'
        }
      ]})
        await camp.save();
    }
}
seedDb().then(()=>{//seedDb returns a promise because it is an async function
    mongoose.connection.close()//to close the connection with database
})                                                                                                                                                                                                                                                                                            