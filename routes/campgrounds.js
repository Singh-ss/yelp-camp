const express = require('express');
const router = express.Router();
const Campground = require('../models/campground.js');
const wrapAsync = require('../utilities/catchAsync.js');
const appError = require('../utilities/errorClass.js');
const { campgroundSchema } = require('../joiSchema.js');

const { isLoggedIn } = require('../middleware.js');

//campground validation
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        throw new appError(msg, 400);
    } else {
        next();
    }
}

//campground validation
router.get('/', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new.ejs');
});

router.post('/', isLoggedIn, validateCampground, wrapAsync(async (req, res) => {
    // if (!req.body.campground) throw new appError('Campground galat hai', 400);
    const camp = new Campground(req.body.campground);
    await camp.save();
    req.flash('success', 'Successfully formed the campground');
    res.redirect(`/campgrounds/${camp._id}`);
}))

router.get('/:id', wrapAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews');
    if (!camp) {
        req.flash('error', 'That campground does not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs', { camp });
}));

router.get('/:id/edit', isLoggedIn, wrapAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
        req.flash('error', 'That campground does not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit.ejs', { camp });
}))

router.put('/:id', isLoggedIn, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated the campground');
    res.redirect(`/campgrounds/${camp._id}`);
}))

router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground');
    res.redirect('/campgrounds');
}))

module.exports = router;