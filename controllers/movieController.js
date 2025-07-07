const fs = require('fs');
const movies = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'))

exports.validateMovieData = (req, res, next) => {
  if (!req.body || !req.body.title || !req.body.year || !req.body.genre) {
    return res.status(400).json({
      message: 'Invalid movie data! Please provide title, year, and genre.',
      success: false
    });
  }
  next();
}
// Getting all Moveies
exports.getAllMovies =(req, res) => {
  try {
    res.status(200).json({
      message: 'Movies data retrieved successfully',
      count: movies.length,
      requestedAt: req.requestedAt,
      success: true,
      data: movies
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error! Error updating movie',
      success: false
    });
  }
}
// Getting a single movie
exports.getMovieById = (req, res) => {
  try {
    const movieId = parseInt(req.params.id, 10);
    const movie = movies.find(m => m.id === movieId);
    if (!movie) {
      res.status(404).json({
        message: 'Movie not found',
        success: false
      });
    } else {
      res.status(200).json({
        message: 'Movie data retrieved successfully',
        success: true,
        data: movie
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error! Error updating movie',
      success: false
    });
  }
}
// Create a New Movie and write to the file
exports.createMovie = (req, res) => {
  try {
    const newId = movies[movies.length - 1].id + 1;
    const newMovie = { id: newId, ...req.body };
    movies.push(newMovie);
    fs.writeFile('./data/data.json', JSON.stringify(movies, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing data');
      }
    });
    res.status(201).json({
      message: 'Movie added successfully',
      success: true,
      data: newMovie
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error! Error updating movie',
      success: false
    });

  }
}
// Update a Movie
exports.updateMovie = (req, res) => {
  try {
    const movieId = parseInt(req.params.id, 10);
    const index = movies.findIndex(m => m.id === movieId);

    if (index === -1) {
      return res.status(404).json({
        message: 'Movie not found',
        success: false
      });
    }

    // Merge the existing movie with the updated fields
    const updatedMovie = { ...movies[index], ...req.body };

    movies[index] = updatedMovie;

    fs.writeFile('./data/data.json', JSON.stringify(movies, null, 2), (err) => {
      if (err) {
        return res.status(500).json({
          message: 'Error writing data',
          success: false
        });
      }

      res.status(200).json({
        message: 'Movie updated successfully',
        success: true,
        data: updatedMovie
      });
    });

  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error! Error updating movie',
      success: false
    });
  }
}
// Delete a Movie
exports.deleteMovie = (req, res) => {
  movieId = parseInt(req.params.id, 10);
  const movieToDelete = movies.find(m => m.id === movieId);
  const index = movies.findIndex(m => m.id === movieId);
  if (!movieToDelete || index === -1) {
    return res.status(404).json({
      message: 'Movie not found',
      success: false
    });
  }
  movies.splice(index, 1);
  fs.writeFile('./data/data.json', JSON.stringify(movies, null, 2), (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Error writing data',
        success: false
      });
    }
    res.status(204).json({
      message: 'Movie deleted successfully',
      success: true,
      data: null
    });
  })
}