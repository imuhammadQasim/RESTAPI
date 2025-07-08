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
        trim: true,
    },
    releaseYear: {
        type: Number,
        required: [true, "Release year is required"],
    },
    releaseDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value <= new Date();
            },
            message: "Release date cannot be in the future"
        }
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"],
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
    totalRating: {
        type: Number,
        default: 0,
    },
    thumbnail:{
        type: String,
    },
    actors: {
        type: [String],
        required: [true, "Actor is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0
    },
}, { timestamps: true,versionKey: false} )

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;