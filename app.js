const express = require('express');
const morgan = require('morgan');
const playstore = require('./playstore.js');
const app = express();
app.use(morgan('common'));

const genreVals = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];

app.get('/apps', (req, res) => {
  let results;

  if (req.query.sort && (req.query.sort !== 'Rating' && req.query.sort !== 'App'))
    return res.status(400).send('Error sort must be by rating or app');

  if (req.query.genres && !genreVals.includes(req.query.genres))
    return res.status(400).send(`Error, genre values must be one of ${genreVals.join(', ')}`);

  if (req.query.genres) {
    results = playstore.filter(app => app.Genres.includes(req.query.genres));
  } else results = playstore;

  const sort = req.query.sort;
  if (sort) {
    if (sort === 'App')
      results = results.sort((a, b) => (a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0));
    if (sort === 'Rating')
      results = results.sort((a, b) => (a[sort] < b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0));
  }

  res.send(results);
});

module.exports = app;
