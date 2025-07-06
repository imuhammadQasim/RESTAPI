const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const fs = require('fs');
const PORT = process.env.PORT || 4000;

const movies = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'))
app.use(express.json());
// Getting all Moveies
const getAllMovies =(req, res) => {
  try {
    res.status(200).json({
      message: 'Movies data retrieved successfully',
      count: movies.length,
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
const getMovieById = (req, res) => {
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
const createMovie = (req, res) => {
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
const updateMovie = (req, res) => {
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
const deleteMovie = (req, res) => {
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
// app.get('/api/v1/data', getAllMovies);
// app.get('/api/v1/data/:id/', getMovieById);
// app.post('/api/v1/data', createMovie);
// app.patch('/api/v1/data/:id', updateMovie);
// app.delete('/api/v1/data/:id',deleteMovie );


app.route('/api/v1/data')
  .get(getAllMovies)
  .post(createMovie);
app.route('/api/v1/data/:id')
  .get(getMovieById)
  .patch(updateMovie)
  .delete(deleteMovie);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api/v1/data`);
})