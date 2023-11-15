const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground.js');
const methodOverride = require('method-override');
const engine = require('ejs-mate');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.engine('ejs', engine);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new.ejs');
});

app.post('/campgrounds', async (req, res) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
})

app.get('/campgrounds/:id', async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/show.ejs', { camp });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit.ejs', { camp });
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${camp._id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log('Connected to 3000');
});