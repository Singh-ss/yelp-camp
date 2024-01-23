const express = require('express');
const router = express.Router();
const Campground = require('../models/campground.js');
const wrapAsync = require('../utilities/catchAsync.js');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');

const campgrounds = require('../controllers/campgrounds.js');

router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, wrapAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(wrapAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm))


module.exports = router;