const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParse = require('body-parser');
let app = express();

let db = new sqlite3.Database('./db/alarms.db', sqlite3.OPEN_READWRITE);

app.use(bodyParse.json());

app.use('/db/init', function (req, res) {
    db.run('CREATE TABLE temperatures(id int, date dateTime, temperature float)', (e) => {
        if (e !== null) {
            console.log(e);
            res.status(500).send(e);
        } else {
            res.status(200).send('Init ok');
        }
    })
});

app.get('/temp/last', function (req, res) {
    const params = IDParams(req);
    db.get("SELECT temperature FROM temperatures "+ params.where + " ORDER BY date DESC", params.args, function (err, result) {
        if (err == null && result.hasOwnProperty('temperature')) {
            res.status(200).send(result);
        } else {
            res.status(500).send(err)
        }
    })
});

function IDParams(req) {
    let args = [];
    let where = "";
    if (req.query.hasOwnProperty('id')) {
        where = "WHERE id = ?";
        args.push(req.query.id);
    }
    return {where, args};
}

app.get('/temp', function (req, res) {
    const params = IDParams(req);
    db.all("SELECT date, temperature FROM temperatures " + params.where + " ORDER BY date DESC", params.args, function (err, result) {
        res.status(200).send(result);
    });
});

app.post('/temp', function (req, res) {
    let body = req.body;
    if (body === undefined || body.id === undefined || body.temp === undefined) {
        res.status(500).send('Not enough parameters');
        return;
    }
    db.run('INSERT INTO temperatures(id, date, temperature)' +
        ' VALUES (?, ?, ?)', [body.id, Date.now(), body.temp], (e) => {
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