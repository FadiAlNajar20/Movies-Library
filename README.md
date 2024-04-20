# Movies-Library

**Author Name**: Fadi Al-Najar

## WRRC
**Image of WRRC** :
!["WRRC"](image\wrrc.webp)

## Overview
In today's lab, I created a database, added data to it, and retrieved data from it.

## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->
1. Install the **Postgres DB** using `npm install pg`.
2. Creating the Database: 
* In terminal `CREATE DATABASE movie`.
3. Creating the Table:
* Create a `schema.sql` file in my porject.
* Command for **CREATE TABLE :**
 ```sql
CREATE TABLE movie(
    id SERIAL PRIMARY KEY,
    title varchar(255) NOT NULL,
    release_date varchar(255) INTEGER NOT NULL,
    poster_path varchar(255) NOT NULL,
    overview varchar(255) NOT NULL
);
```
3. Connecting the Database with the table:
*  `psql -d movie -f schema.sql`
4. Write a queries in my server:
 ```js
const url="postgres://username:password@localhost:5432/databaseName"; //store it in the .env file

// create a new client instance
const { Client } = require('pg');
const client = new Client(url);

// connect to db
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening ${PORT}`);
    });
})
```
5. Use `client.query()` to do CRUD
6. Insert the query in database and send it to the fornt-end
```js
let { title, release_date, poster_path, overview } = req.body;
    let sql = 'INSERT INTO movies(title, release_date, poster_path, overview) VALUES($1, $2, $3, $4) RETURNING *;'
    let values = [title, release_date, poster_path, overview];
    client.query(sql, values).then((result) => {
        return res.status(201).json(result.rows[0]);
    }).catch((error) => {
        errorHandler(error, req, res);
    });
```
7. Select all record form database and send it to the fornt-end
```js
let sql = 'SELECT * FROM movies;'
    client.query(sql).then((result)=>{
        return res.status(200).json(result.rows);
    }).catch((error)=>{
        errorHandler(error, req, res);
    });
```
## Project Features
<!-- What are the features included in you app -->
1. Require the **Postgres** `const { Client } = require('pg');`.
2. Use the routes like **GET and POST** method `app.post("/addMovie", handleAddMovie);
app.get("/getMovies", handleGetMovies);`.
3. Add middleware that parses incoming request bodies with JSON payloads `app.use(express.json());`.