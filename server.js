'use strict';

require('dotenv').config();
const getData = require('./MovieData/data.json');
const express = require('express');
const { default: axios } = require('axios');
const cors = require("cors");

const apiKey = process.env.API_KEY;
const pgUrl = process.env.PG_URL;
const PORT = process.env.PORT || 3001;

const app = express();
const { Client } = require('pg');
const client = new Client(pgUrl);
app.use(cors());
app.use(express.json());

// Routs for the API 
app.get('/', handelHome);
app.get("/favorite", handelFavorite);
app.get("/trending", handelTrending);
app.get("/search", handelSearch);
app.get("/popular", handelPopular);
app.get("/top", handelTop);

//CRUD Routs for DB
app.post("/addMovie", handleAddMovie);
app.get("/getAllMovie", handleGetMovies);
app.delete("/DELETE/:id", handleDelete);
app.put("/UPDATE/:id", handleUpdate);
app.get("/getMovie/:id", handleGetMovieID);

//Handle Error and middleware
app.use(errorHandlerPage);
app.use(errorHandler);


function handelHome(erq, res) {
    let newMovie = new Movie(getData.title, getData.poster_path, getData.overview);
    res.status(200).json(newMovie);
}

function handelFavorite(req, res) {
    res.status(200).send('Welcome to Favorite Page');
}

function handelTrending(req, res) {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
    axios.get(url)
        .then(response => {
            let data = response.data.results.map((element) => {
                console.log(element);
                let newMovie = new Movie(element.id, element.title || element.original_title || element.original_name, element.release_date || element.first_air_date, element.poster_path, element.overview);
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

function handelTop(req, res) {
    const topMovie = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
    axios.get(topMovie)
        .then((response) => {
            let popularMovie = response.data.results.map((item) => {
                return new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
            })
            res.json(popularMovie);
        }).catch((error) => {
            errorHandler(error, req, res);
        })
}

function handleAddMovie(req, res) {
    console.log(req.body);
    let { title, release_date, poster_path, overview, comment } = req.body;
    let sql = "INSERT INTO movies(title, release_date, poster_path, overview, comment) VALUES($1, $2, $3, $4, $5) RETURNING *;"
    let values = [title, release_date, poster_path, overview, comment];
    client.query(sql, values).then((result) => {
        return res.status(201).json(result.rows[0]);
    }).catch((error) => {
        errorHandler(error, req, res);
    });
}

function handleGetMovies(req, res) {
    let sql = 'SELECT * FROM movies;'
    client.query(sql).then((result) => {
        return res.status(200).json(result.rows);
    }).catch((error) => {
        errorHandler(error, req, res);
    })
}

function handleDelete(req, res) {
    let id = req.params.id;
    let sql = `DELETE FROM movies WHERE id=${id};`;
    client.query(sql).then((result) => {
        console.log(result);
        return res.json(result.rows[0]);
    }).catch((error) => {
        errorHandler(error, req, res);
    });
}

function handleUpdate(req, res) {
    let id = req.params.id;
    let { title, release_date, poster_path, overview, comment } = req.body;
    let sql = `UPDATE movies SET title=$1, release_date=$2, poster_path=$3, overview=$4, comment=$5 WHERE id=${id} RETURNING *;`
    const values = [title, release_date, poster_path, overview, comment];
    client.query(sql, values).then((result) => {
        return res.json(result.rows[0]);
    }).catch((error) => {
        errorHandler(error, req, res);
    });
}

function handleGetMovieID(req, res) {
    let id = req.params.id;
    let sql = `SELECT * FROM movies WHERE id=${id};`
    client.query(sql).then((result) => {
        return res.json(result.rows);
    }).catch((error) => {
        errorHandler(error, req, res);
    });
}

function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

function errorHandlerPage(req, res) {
    res.status(404).send('Page nof found');
}

function errorHandler(error, erq, res) {
    res.status(500).send(error);
}

client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`The server start at port ${PORT}`);
    });
});