const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParse = require('body-parser');
let app = express();

let db = new sqlite3.Database('./db/alarms.db', sqlite3.OPEN_READWRITE);


app.use(bodyParse.json());

app.use('/initDB', function (req, res) {
   db.run('CREATE TABLE temperatures(id int, date dateTime, temperature float)', (e) => {
       if (e !== null) {
           console.log(e);
           res.status(500).send(e);
       } else {
           res.status(200).send('Init ok');
       }
   })
});

app.get('/lastTemp', )

app.post('/temp', function (req, res) {
    let body = req.body;
    if (body === undefined || body.id === undefined || body.dateTime === undefined || body.temp === undefined) {
        res.status(500).send('Not enough parameters');
        return;
    }
    db.run('INSERT INTO temperatures(id, date, temperature)' +
        ' VALUES (?, ?, ?)', [body.id, body.dateTime, body.temp], (e) => {
        if (e !== null)
            res.status(500).send(e);
        else {
            res.status(200).send('db updated');
        }
    })

});

app.use('/', function (req, res) {
    res.status(200).send('welcome');
});

app.listen(8080);