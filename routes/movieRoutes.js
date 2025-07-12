const express = require('express');
const router = express.Router();
const { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie ,validateMovieData} = require('./../controllers/movieController.js');


// app.get('/api/v1/data', getAllMovies);
// app.get('/api/v1/data/:id/', getMovieById);
// app.post('/api/v1/data', createMovie);
// app.patch('/api/v1/data/:id', updateMovie);
// app.delete('/api/v1/data/:id',deleteMovie );

router.route('./highest-rated')
.get(getAllMovies);

router.route('/')
  .get(getAllMovies)
  .post(validateMovieData, createMovie);
router.route('/:id')
  .get(getMovieById)
  .patch(updateMovie)
  .delete(deleteMovie);

module.exports = router;