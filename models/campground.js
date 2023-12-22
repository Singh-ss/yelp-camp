const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    img: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

CampgroundSchema.post('findOneAndDelete', async (camp) => {
    if (camp.reviews.length) {
        await Review.deleteMany({ _id: { $in: camp.reviews } });
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);