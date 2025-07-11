const fs = require('fs');
const movies = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'))
const Movie = require('../model/movieModel');
exports.validateMovieData = (req, res, next) => {
  if (!req.body || !req.body.title || !req.body.releaseDate || !req.body.genre) {
    return res.status(400).json({
      message: 'Invalid movie data! Please provide title, year, and genre.',
      success: false
    });
  }
  next();
}
// Getting all Moveies
exports.getAllMovies = async (req, res) => {
  try {
    // Step 1: Clone req.query and remove reserved fields
    const queryObj = { ...req.query };
    const excludedFields = ['sort', 'page', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Step 2: Build MongoDB filter
    const mongoQuery = {};

    for (const key in queryObj) {
      const value = queryObj[key];
      const match = key.match(/^(\w+)\[(\w+)\]$/); // e.g. duration[gte]

      if (match) {
        const field = match[1];       // e.g. "duration"
        const operator = match[2];    // e.g. "gte"

        if (!mongoQuery[field]) mongoQuery[field] = {};
        mongoQuery[field][`$${operator}`] = isNaN(value) ? value : Number(value);
      } else {
        mongoQuery[key] = isNaN(value) ? value : Number(value);
      }
    }

    // console.log('MongoDB Filter:', mongoQuery);    
    let query = Movie.find(mongoQuery);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    const movies = await query;
    if (!movies.length) {
      return res.status(404).json({
        message: 'No movies found',
        success: false
      });
    }

    res.status(200).json({
      message: 'Movies fetched successfully',
      count: movies.length,
      success: true,
      data: movies
    });

  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      message: `Internal server error - ${error.message}`,
      success: false
    });
  }
};


// Getting a single movie
exports.getMovieById = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movies = await Movie.findById(movieId);
    if (!movies) {
      return res.status(404).json({
        message: 'Movie not found',
        success: false
      });
    }
    res.status(200).json({
      message: 'Movie fetched successfully',
      success: true,
      data: movies,
    });
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false
    });

  }
}
// Create a New Movie and write to the file
exports.createMovie = async (req, res) => {
  try {
    const existingMovie = await Movie.findOne({ title: req.body.title });
    if (existingMovie) {
      return res.status(400).json({
        message: 'Movie with this title already exists',
        success: false
      });
    }
    const newMovie = await Movie.create(req.body);
    newMovie.save();
    res.status(201).json({
      message: 'Movie created successfully',
      success: true,
      data: newMovie
    });

  } catch (error) {
    console.error('Error creating movie:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Movie with this title already exists',
        success: false
      });
    }

    res.status(500).json({
      message: 'Internal server error',
      success: false
    });

  }
}
// Update a Movie
exports.updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const updatedData = req.body;
    const movie = await Movie.findByIdAndUpdate(movieId, updatedData, { new: true, runValidators: true });
    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found',
        success: false
      });
    }
    res.status(200).json({
      message: 'Movie updated successfully',
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
}
// Delete a Movie
exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findByIdAndDelete(movieId);
    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found',
        success: false
      });
    }
    res.status(200).json({
      message: 'Movie deleted successfully',
      success: true
    });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
}