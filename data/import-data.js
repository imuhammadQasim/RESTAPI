const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Movie = require('../model/movieModel');
const fs = require('fs');
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

const movies = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf-8'));

const delteMovies = async () => {
    try {
        await Movie.deleteMany();
        console.log('All movies deleted successfully');
    } catch (err) {
        console.error('Error deleting movies:', err);
    }
    process.exit();
}

const importMovies = async () => {
    try {
        await Movie.create(movies);
        console.log('Movies imported successfully');
    } catch (err) {
        console.error('Error importing movies:', err);
    }
    process.exit();
}

console.log(process.argv);
if (process.argv[2] === '--import') {
    importMovies();
    console.log('Movies imported successfully');
} else if (process.argv[2] === '--delete') {
    delteMovies();
    console.log('All movies deleted successfully');
}