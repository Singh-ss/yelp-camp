const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');

const passport = require('passport');

const { storeReturnTo } = require('../middleware');

const reviews = require('../controllers/users');

router.route('/register')
    .get(reviews.renderRegister)
    .post(catchAsync(reviews.register));

router.route('/login')
    .get(reviews.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), reviews.login)

router.get('/logout', reviews.logout);

module.exports = router;
