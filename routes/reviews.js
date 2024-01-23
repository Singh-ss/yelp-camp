const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utilities/catchAsync.js');

const Review = require('../models/review.js');
const Campground = require('../models/campground.js');

const reviews = require('../controllers/reviews.js');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js')

router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;