const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new.ejs');
}

module.exports.createCampground = async (req, res) => {
    // if (!req.body.campground) throw new appError('Campground galat hai', 400);
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully formed the campground');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCampground = async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'That campground does not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs', { camp });
}

module.exports.renderEditForm = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
        req.flash('error', 'That campground does not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit.ejs', { camp });
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated the campground');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground');
    res.redirect('/campgrounds');
}