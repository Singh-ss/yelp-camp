const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');
const { string } = require('joi');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong><br>
    <small style="font-weight: lighter;">${this.location}</small>
    <p>${this.description.substring(0, 20)}...</p>`
});

CampgroundSchema.post('findOneAndDelete', async (camp) => {
    if (camp.reviews.length) {
        await Review.deleteMany({ _id: { $in: camp.reviews } });
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);