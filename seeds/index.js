// will connect to mongoose & use models we created
const mongoose = require('mongoose')
const cities = require('./cities') // import cities seed file
const {places, descriptors} = require('./seedHelpers') //import deeHelper.js for descriptors & places
const Campground = require('../models/campground')//import models


mongoose.connect('mongodb://localhost:27017/yelp-camp')

// logic check if theres an error running database
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database Opened!")
});

// function expects array to be passed
//generate random # for places and descriptor
//number is range of 0 to index length
const sample = array => array[Math.floor(Math.random() * array.length)] 

const seedDB = async() => {
    await Campground.deleteMany({});//deletes all items in database
    //for loop to add multiple camegrounds at random from seed file
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000); // generate random # from 0-1000
        const camp = new Campground({ // create new campground object using data from cities.js file, indexing through array
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`
        })
        await camp.save()
    }
    // const c = new Campground({title: "Yellow fields"});//create new campground object
    // await c.save() // saves new object to collection yelp-camp
} 
//execute function above once, then close database connection
seedDB().then(() => {
    mongoose.connection.close()
})