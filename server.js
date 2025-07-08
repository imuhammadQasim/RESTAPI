const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Movie = require('./model/movieModel');
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const testMovie = new Movie({
  title: 'The Social Network',
  description: 'A drama about the founding of Facebook, exploring the complexities of friendship, ambition, and betrayal.',
  releaseDate: new Date('2010-07-16'),
  genre: ['Sci-Fi', 'Action'],
  rating: 10
});

testMovie.save().then(() => {
  console.log('Test movie saved successfully');
}).catch((err) => {
  console.error('Error saving test movie:', err);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api/v1/data`);
})