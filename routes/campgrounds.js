const express = require('express');
const router = express.Router();
const Campground = require('../models/campground.js');
const wrapAsync = require('../utilities/catchAsync.js');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');

const campgrounds = require('../controllers/campgrounds.js');

const { storage } = require('../cloudinary');

const multer = require('multer')
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.createCampground));


router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(wrapAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm))


module.exports = router;