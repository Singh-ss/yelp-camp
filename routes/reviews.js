const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utilities/catchAsync.js');
const appError = require('../utilities/errorClass.js');

const { reviewSchema } = require('../joiSchema.js');
const Review = require('../models/review.js');
const Campground = require('../models/campground.js');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        throw new appError(msg, 400);
    } else {
        next();
    }
}

router.post('/', validateReview, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success', 'Successfully made the review');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;