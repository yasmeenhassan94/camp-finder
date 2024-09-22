const mongoose = require('mongoose');
const schema = mongoose.Schema;

const CampgroundSchema = new schema({
    title : String,
    price : String,
    description: String,
    location: String 
})

//export module here and import at app.js
//Param 1 = name, param 2 = model schema
module.exports = mongoose.model('Campground', CampgroundSchema)