'use strict';

const express = require('express');
const getData = require('./MovieData/data.json');

const app = express();
const port = 5000;

app.get('/', handelHome);
app.get("/favorite", handelFavorite);
app.get("*", (req, res) => {
    res.status(404).send('Page Not Found');
});
app.get("*", (req, res) => {
    const serverEror = {
        status: 500,
        responseText: "Sorry, something went wrong",
    };
    res.status(500).send(serverEror);
});

function handelHome(erq, res) {
    let newMovie = new Movie(getData.title, getData.poster_path, getData.overview);
    res.json(newMovie);
}

function handelFavorite(req, res) {
    res.send('Welcome to Favorite Page');
}

app.listen(port, () => {
    console.log(`The server start at port ${port}`);
});

function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}