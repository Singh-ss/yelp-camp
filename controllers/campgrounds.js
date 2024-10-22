const Campground = require('../models/campground');

const { cloudinary } = require('../cloudinary');

const axios = require('axios');
const openCageApiKey = process.env.OPEN_CAGE_API_KEY;

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new.ejs');
}

module.exports.createCampground = async (req, res) => {
    const location = req.body.campground.location;
    const limit = 1;
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${openCageApiKey}&limit=${limit}`);
    const geojsonCoordinates = response.data.results.map(result => ({
        type: 'Point',
        coordinates: [result.geometry.lng, result.geometry.lat]
    }));
    const camp = new Campground(req.body.campground);
    camp.geometry = geojsonCoordinates[0];
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;
    await camp.save();
    // console.log(camp);
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
    // console.log(req.body);

    const location = req.body.campground.location;
    const limit = 1;
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${openCageApiKey}&limit=${limit}`);
    const geojsonCoordinates = response.data.results.map(result => ({
        type: 'Point',
        coordinates: [result.geometry.lng, result.geometry.lat]
    }));

    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

    camp.geometry = geojsonCoordinates[0];

    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    await camp.save();
    if (req.body.deleteImages) {
        for (filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        // console.log(camp);
    }
    req.flash('success', 'Successfully updated the campground');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground');
    res.redirect('/campgrounds');
}