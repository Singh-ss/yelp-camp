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
const campgroundRouter = require('./routes/campgrounds.js');
const reviewRouter = require('./routes/reviews.js');
const session = require('express-session');
const flash = require('connect-flash');

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
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thissecretisnotsafe',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.engine('ejs', engine);

//routes from routes folder
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);

app.get('/', (req, res) => {
    res.render('home');
});

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