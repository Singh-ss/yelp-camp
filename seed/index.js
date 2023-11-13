const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelper');
const cities = require('./cities');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
    console.log("Connected to mongoose database!");
})

const randomArray = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    console.log("Deleted the database!");
    for (let i = 0; i < 50; i++) {
        const seed = new Campground({
            title: `${randomArray(descriptors)} ${randomArray(places)}`,
            location: `${randomArray(cities).city}, ${randomArray(cities).state}`
        });
        await seed.save();
    }
    console.log("Seeded the database!")
};

seedDb()
    .then(() => {
        db.close();
    });

