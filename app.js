//including Modules 
var path = require('path')
var express =require('express')
var zipdb = require('zippity-do-dah')
var ForecastIo = require('forecastio')

//creating the express app
var app =express()
//creating forecastIO object with the api key generated
var weather = new ForecastIo("");
//serving a satatic files out of public directory
app.use(express.static(path.resolve(__dirname,"public")))
//serves views files out of views directory 
app.set("views",path.resolve(__dirname,"views"))
//using ejs as view engine
app.set("view engine","ejs");

//rendering  index view if you hit the homepage
app.get("/",(req,res)=>{
    res.render("index");
})
app.get(/^\/(\d{5})$/,(req,res,next)=>{
   //Captures the specified ZIP Code and passes it as req.params[0]
   //grabs location data with zip code
    var zipcode = req.params[0];
    var location = zipdb.zipcode(zipcode)
    if(!location.zipcode){
        next();
        return;
    }
    var latitude = location.latitude;
    var longitude = location.longitude;
    
    weather.forecast(latitude, longitude, function(err, data) {
        if (err) {
        next();
        return;
        }

        //sending a json object 
        res.json({
            zipcode:zipcode,
            temperature:data.currently.temperature
        });
});
});
app.use((req,res)=>{
    res.status(404).render("404");
})
app.listen(3000);