const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelper');
const cities = require('./cities');

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";
mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
    console.log("Connected to mongoose database!");
})

const randomArray = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    console.log("Deleted the database!");
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 2500) + 500;
        const seed = new Campground({
            title: `${randomArray(descriptors)} ${randomArray(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].lng,
                    cities[random1000].lat
                ]
            },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis veniam pariatur, nihil possimus asperiores perferendis illum mollitia nobis quia reprehenderit reiciendis ab, atque, delectus qui deserunt corrupti? Itaque, doloremque laudantium.',
            images: [
                {
                    url: 'https://res.cloudinary.com/dlfqidsk2/image/upload/v1706117385/YelpCamp/jvjkzrh8mxtwmuzckubj.png',
                    filename: 'YelpCamp/jvjkzrh8mxtwmuzckubj'
                },
                {
                    url: 'https://res.cloudinary.com/dlfqidsk2/image/upload/v1706117386/YelpCamp/qj2kvb3as2ktjwwma7w0.png',
                    filename: 'YelpCamp/qj2kvb3as2ktjwwma7w0'
                },
                {
                    url: 'https://res.cloudinary.com/dlfqidsk2/image/upload/v1706117387/YelpCamp/zitjuytuabhtcgcym7px.png',
                    filename: 'YelpCamp/zitjuytuabhtcgcym7px'
                }
            ],
            author: '65ac07cd0728604f161b7aa4'
        });
        await seed.save();
    }
    console.log("Seeded the database!")
};

seedDb()
    .then(() => {
        db.close();
    });
