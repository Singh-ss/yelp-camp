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
        const price = Math.floor(Math.random() * 2500) + 500;
        const seed = new Campground({
            title: `${randomArray(descriptors)} ${randomArray(places)}`,
            location: `${randomArray(cities).city}, ${randomArray(cities).state}`,
            price: price,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis veniam pariatur, nihil possimus asperiores perferendis illum mollitia nobis quia reprehenderit reiciendis ab, atque, delectus qui deserunt corrupti? Itaque, doloremque laudantium.',
            img: 'https://source.unsplash.com/collection/483251'
        });
        await seed.save();
    }
    console.log("Seeded the database!")
};

seedDb()
    .then(() => {
        db.close();
    });

