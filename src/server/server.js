const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const serverSettings = require('./config/settings').server;
const db = require('./db/db');
const urlencode = require('./helpers/urlencode');

db.connect();

app.use(express.static('build'));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send(path.resolve('build/index.html'));
});

app.get(serverSettings.api + '*', function(req, res, next){
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    next();
});

app.post(serverSettings.api + '*', function(req, res, next){
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    next();
});


//check route
app.get(serverSettings.api + 'check', function (req, res){
    res.json({"status" : "ok"});
});

app.get(serverSettings.api + 'create', async function (req, res){
    try {
        const create = await db.createTable();
        res.json({"status": create.status});
    }
    catch (e) {
        res.json({"status" : e.status, smg: e});
    }
});

app.post(serverSettings.api + 'longToShort', async function (req, res) {
    const url = req.body.url || '';
    if(url) {
        try{
            const selectRes = await db.selectByLongUrl(url);
            if (selectRes.result && selectRes.result.length == 0) {

                const maxRes = await db.getMaxId();
                const newNum = maxRes.result && maxRes.result[0].id > 0 ? maxRes.result[0].id+1 : 1;
                const shortUrl = urlencode.encode(newNum);
                const insertRes = await db.insert('longUrl', url);

                res.json({"status" : insertRes.status, shortUrl: serverSettings.host + shortUrl });

            } else {
                const shortUrl = urlencode.encode(selectRes.result[0].rowid);
                res.json({"status" : "success", shortUrl: serverSettings.host + shortUrl });
            }
        }
        catch (e) {
            console.log(e);
            res.json({"status" : e.status, msg: 'Fail from ' + e.source });
        }
    } else {
        res.json({"status" : "error", msg: 'Url is empty'});
    }
});

app.get('/:encoded_id', async function (req, res) {
    const encodedId = req.params.encoded_id;
    const id = urlencode.decode(encodedId);
    try {
        const longRes = await db.selectByID(id);
        res.redirect(longRes.result.longUrl);
    }
    catch (e) {
        res.redirect(serverSettings.host);
    }
});



const server = app.listen(serverSettings.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://', host, port);
});
