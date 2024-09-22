const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')//need this for PUT & patch requests for UPDATE (CRUD)
const Campground = require('./models/campground')//import models

mongoose.connect('mongodb://localhost:27017/yelp-camp')

// logic check if theres an error running database
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database Opened!")
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')) // so directory is accessible from root folder

app.use(express.urlencoded({extended: true}))// we add this to be able to parse the req.body, tells express on every request return as function
app.use(methodOverride('_method'))//_method is our query string

app.get('/', (req,res) =>{
    res.render("home")
})

// app.get('/makecampground', async(req,res)=>{
//     const camp = new Campground({title: 'Backyard'})
//     await camp.save();
//     res.send(camp)
// })

app.get('/campgrounds', async (req, res) =>{
   const campgrounds =  await Campground.find({}); // returns all campgrounds
   res.render('campgrounds/index', { campgrounds })
})


/**************************************
 * CREATE
**************************************/
// this route must be placed above route campgrounds/:id or it will treat new as an ID , ORDER matters when creating routes
app.get('/campgrounds/new', async (req,res)=>{
    res.render('campgrounds/new')//will render new file which is a form to input data for new object
})
// need to make a post for the new campground where form is submitted to
app.post('/campgrounds', async (req,res) =>{
    //create new campground object to save data passed in through form
    const campground = new Campground(req.body.campground)// to be able to pasrse body we have to add express.urlencoded
    await campground.save() //save it to database
    //whenever we use POST request we use redirect to send to another page
    res.redirect(`/campgrounds/${campground.id}`)//wil; take us to detail page of new camground created
})

/**************************************
 * READ
**************************************/
//shows a campground details page
app.get('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params //retrieve ID from object making request
    const campground = await Campground.findById(id)//use find by id method to retrieve camground data from unique ID
        // two lines above can be summarzied to 
        //  const campground = await Campground.findById(req.params.id)
    console.log(campground);//test to see if its retrieved in console log
    res.render('campgrounds/show', {campground}) //render show.ejs file, pass in object data of campground to access on show.ejs file
})

/**************************************
 * UPDATE
**************************************/
//this route requires an id to edit
//edit must be a PUT or PATCH request
// must npm i method-override to use PATCH & PUT requests
app.get('/campgrounds/:id/edit', async (req,res) =>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
})

app.put('/campgrounds/:id', async (req,res)=>{
    const {id} = req.params
    const campground= await Campground.findByIdAndUpdate(id, {...req.body.campground}) //...spread syntax copies all elements doesnt pass actuall object which is good for not wanting to change data
    res.redirect(`/campgrounds/${campground.id}`)//will take us to detail page of updated campground 

})
/**************************************
 * DELETE
**************************************/
app.delete('/campgrounds/:id', async (req,res)=>{
    const {id} =req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')

})

app.listen (3000, () =>{
    console.log('its workinnnn')
})