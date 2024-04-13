'use strict';

const express = require('express');
const getData = require('./MovieData/data.json');

const app = express();
const port = 5000;

app.get('/', handelHome);
app.get("/favorite", handelFavorite);
app.get("*", (req, res) => {
    const pageNotFound = {
        status: 404,
        responseText: "page not found error",
    };
    res.status(404).send(pageNotFound);
});

app.use(errorHandler);

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        message: "Sorry, something went wrong",
    };
    res.status(500).send(err);
}

function handelHome(erq, res) {
    let newMovie = new Movie(getData.title, getData.poster_path, getData.overview);
    res.json(newMovie);
}

function handelFavorite(req, res) {
    res.status(200).send('Welcome to Favorite Page');
}

app.listen(port, () => {
    console.log(`The server start at port ${port}`);
});

function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}