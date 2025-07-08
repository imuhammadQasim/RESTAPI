const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Title is required"],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    releaseDate: {
        type: Date,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
        default: 10
    },
})

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;