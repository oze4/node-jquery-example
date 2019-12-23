'use strict'
const express = require('express');
const app = express();
const path = require('path');
const database = require('./mockDatabase.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('port', 8089);

// Teachers Route
app.get('/teachers', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Params Route 
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