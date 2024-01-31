
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelper');
const cities = require('./cities');
require('dotenv').config();
const uri = process.env.DB_URL;

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

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
            author: '65b9e23669c22dcf3185825e'
        });
        await seed.save();
    }
    console.log("Seeded the database!")
};

async function run() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        await seedDb();
    } finally {
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
    }
}
run().catch(console.dir);
