'use strict'
const express = require('express');
const app = express();
const path = require('path');
const database = require('./mockDatabase.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('port', 8089);

// Teachers Route
/**
 * Just a note: if you are using query strings, and sending them to the same path
 * you have to modify the logic in the 'shared' path.
 * 
 * This is because when you're using query strings, you don't have to specify
 * anything in the route, like you do with params (eg: '/teachers/:str'). This
 * is why you would have to change the logic of this if you are sending query
 * strings to a route you are using to serve html.
 */
app.get('/teachers', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/index.html'));
    // If you're using query strings for this path '/teachers' you would have
    // to have some logic like:
    // if (req.query.namesearch !== "") {
    //   let id = req.query.namesearch;
         // more logic here on searching db for teacher   
    // } else {
         // otherwise just server html
    //   res.sendFile(path.join(__dirname + '/index.html'));
    // }
});

// Params Route 
/**
 * Instead of just making the route '/teachers/:str' I had
 * to differentiate between routes. 
 */
app.get('/teachers/params/:str', (req, res, next) => {
    try {
        let id = req.params.str;
        let teacher = database.find(t => t.id === Number(id)); // Number(id) converts string to int
        res.status(200).send(teacher);
    } catch {
        res.status(500).send("Unable to find that teacher.");
    }
});

// Query String Route 
/**
 * Instead of just making the route '/teachers?namesearch=' I had
 * to use 'teachers/query' to differentiate from the "main" route
 * for '/teachers'. My goal was not to confuse you.
 */
app.get('/teachers/query', (req, res, next) => {
    try {
        let id = req.query.namesearch;
        let teacher = database.find(t => t.id === Number(id)); // Number(id) converts string to int
        res.status(200).send(teacher);
    } catch {
        res.status(500).send("Unable to find that teacher.");
    }
});

// 404 route - should be last in list
app.use((req, res, next) => {
    res.status(404).send(`Did you mean to browse to <a href='http://localhost:${app.get('port')}/teachers'>'localhost:${app.get('port')}/teachers'</a> ?`);
});

app.listen(app.get('port'), () => {
    console.log(`App started on port ${app.get('port')}`)
});