const express = require('express');
const app = express();
const movieRouter = require('./routes/movieRoutes');


app.use(express.json());
app.use(express.static('public'));
// app.use((req, res, next) => {
//   req.requestedAt = new Date().toISOString();
//   next();
// })
app.use('/api/v1/data' ,movieRouter);
app.use('/', (req, res) => {
  res.status(200).sendFile(__dirname + '/public/views/index.html');
});
module.exports = app;