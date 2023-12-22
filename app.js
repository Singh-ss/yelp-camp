const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground.js');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const wrapAsync = require('./utilities/catchAsync.js');
const appError = require('./utilities/errorClass.js');
const { campgroundSchema, reviewSchema } = require('./joiSchema.js');
const Review = require('./models/review.js');

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

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        throw new appError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        throw new appError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new.ejs');
});

app.post('/campgrounds', validateCampground, wrapAsync(async (req, res) => {
    // if (!req.body.campground) throw new appError('Campground galat hai', 400);
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}))

app.get('/campgrounds/:id', wrapAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show.ejs', { camp });
}));

app.get('/campgrounds/:id/edit', wrapAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit.ejs', { camp });
}))

app.put('/campgrounds/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${camp._id}`);
}))

app.delete('/campgrounds/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.post('/campgrounds/:id/reviews', validateReview, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

app.all('*', (res, req, next) => {
    next(new appError('Nahi mila bhai', 404));
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    //using message in above like status wont save message inside err
    if (!err.message) err.message = 'Kuch galti ho gai hai bhai!!';
    res.status(status).render('error.ejs', { err });
})

app.listen(3000, () => {
    console.log('Connected to 3000');
});