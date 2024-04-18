'use strict';

const express = require('express');
const getData = require('./MovieData/data.json');
const { default: axios } = require('axios');
require('dotenv').config();
const apiKey = process.env.API_KEY;
const app = express();
const port = 5000;

app.get('/', handelHome);
app.get("/favorite", handelFavorite);
app.get("/trending", handelTrending);
app.get("/search", handelSearch);
// Two more routes
app.get("/popular", handelPopular);
app.get("/top", handelTop);
app.get("*", (req, res) => {
    const pageNotFound = {
        status: 404,
        responseText: "page not found error",
    };
    res.status(404).send(pageNotFound);
});

app.use(errorHandler);

function handelTop(req, res) {
    const top = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`
    axios.get(top)
        .then((response) => {
            let popularMovie = response.data.results.map((item) => {
                console.log(item);
                return new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
            })
            res.json(popularMovie);
        }).catch((error) => {
            errorHandler(error, req, res);
        })
}
function handelHome(erq, res) {
    let newMovie = new Movie(getData.title, getData.poster_path, getData.overview);
    res.status(200).json(newMovie);
}

function handelFavorite(req, res) {
    const url = `https://api.themoviedb.org/3/account/19719723/favorite/movies?language=en-US&page=1&sort_by=created_at.asc&api_key=${apiKey}`
    res.status(200).send('Welcome to Favorite Page');
}

function handelTrending(req, res) {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
    axios.get(url)
        .then(response => {
            let data = response.data.results.map((element) => {
                let newMovie = new Movie(element.id, element.name, element.first_air_date, element.poster_path, element.overview);
                return newMovie;
            });
            res.status(200).json(data);
        })
        .catch((error) => {
            errorHandler(error, req, res);
        })
}

function handelSearch(req, res) {
    const movieName = req.query.name;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&page=2`;
    axios.get(url)
        .then(response => {
            res.status(200).json(response.data.results);
        })
        .catch((error) => {
            errorHandler(error, req, res);
        })
}

function handelPopular(req, res) {
    const url = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}`;
    axios.get(url)
        .then((response) => {

            let popularMovie = response.data.results.map((item) => {
                let getData = item.known_for.map((element) => {
                    return new Movie(element.id, element.title, element.release_date, element.poster_path, element.overview);
                });
                return getData;
            })
            res.json(popularMovie);
        }).catch((error) => {
            errorHandler(error, req, res);
        })
}

function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

function errorHandler(error, erq, res) {
    const err = {
        status: 500,
        message: "Sorry, something went wrong",
    };
    res.status(500).send(err);
}

app.listen(port, () => {
    console.log(`The server start at port ${port}`);
});