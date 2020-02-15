const express = require('express');
const app = express();
const logger = require('morgan');
const fetch = require('node-fetch');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(`Mongo Error: ${err}`));

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.get('/randomusers', (req, res) => {
    const url = 'https://randomuser.me/api/?results=20';

    fetch(url)
        .then(res => res.json())
        .then(users => {
            res.render('main/random', { users });
        })
        .catch(err => console.log(err));
});

app.get('/movies', (req, res) => {
    const url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=f991468af55f72d5713869df80441593&language=en-US&page=1';
    const img = 'https://image.tmdb.org/t/p/w500';

    fetch(url)
        .then(res => res.json())
        .then(movies => {
            res.render('main/movies', { movies, url, img })
        })
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});