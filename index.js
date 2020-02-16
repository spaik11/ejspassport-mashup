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
            const sortedUsers = users.results.sort((a, b) => (a.name.last > b.name.last) ? 1 : ((b.name.last > a.name.last) ? -1 : 0))
            res.render('main/random', { sortedUsers });
        })
        .catch(err => console.log(err));
});

app.get('/movies', (req, res) => {
    const url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=';
    const urlEnd = '&language=en-US&page=1';
    const apiKey = process.env.API_KEY
    const img = 'https://image.tmdb.org/t/p/w500';

    fetch(url+apiKey+urlEnd)
        .then(res => res.json())
        .then(movies => {
            res.render('main/movies', { movies, img })
        })
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});