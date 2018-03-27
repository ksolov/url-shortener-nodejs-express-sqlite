const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const serverSettings = require('./settings').server;
const db = require('./db');
const urlencode = require('./urlencode');

db.connect();

app.use(express.static('build'));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.sendFile(path.resolve('build/index.html'));
});

// allow cross origin requests for api GET requests
app.get(serverSettings.api + '*', function(req, res, next){
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    next();
});

// allow cross origin requests for api POST requests
app.post(serverSettings.api + '*', function(req, res, next){
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    next();
});


//check route
app.get(serverSettings.api + 'check', function (req, res, next){
    res.json({"status" : "ok"});
});

app.get(serverSettings.api + 'create', function (req, res, next){
    db.createTable().then((createRes) => {
            if(createRes.status == 'success') {
                res.json({"status": "ok"})
            }else {
                res.json({"status" : "fail"});
            }
        }
    );

});

app.post(serverSettings.api + 'longToShort', function (req, res, next) {
    const url = req.body.url || '';
    if(url) {
        db.selectByLongUrl(url).then(selectRes => {
            if(selectRes.status == 'success') {
                if (selectRes.result && selectRes.result.length == 0) { //вставляем
                    db.getMaxId().then(maxRes => {
                        if(maxRes.status == 'success') {
                            const newNum = maxRes.result[0].id+1;
                            const shortUrl = urlencode.encode(newNum);
                            db.insert('longUrl', url).then(insertRes => {
                                if(insertRes.status == 'success') {
                                    res.json({"status" : "ok", shortUrl: serverSettings.host + shortUrl });
                                } else {
                                    res.json({"status" : "fail", msg: 'Fail from ' + insertRes.source});
                                }
                            });
                        } else {
                            res.json({"status" : "fail", msg: 'Fail from ' + maxRes.source});
                        }
                    });

                } else {//достаем
                    const shortUrl = urlencode.encode(selectRes.result[0].rowid);
                    res.json({"status" : "ok", shortUrl: serverSettings.host + shortUrl });
                }
            } else {
                res.json({"status" : "fail", msg: 'Fail from ' + selectRes.source});
            }
        });
    } else {
        res.json({"status" : "fail", msg: 'Url is empty'});
    }
});

app.get('/:encoded_id', function (req, res, next) {
    const encodedId = req.params.encoded_id;
    const id = urlencode.decode(encodedId);
    db.selectByID(id).then((longRes) => {
        if(longRes.status == 'success') {
            res.redirect(longRes.result[0].longUrl);
        } else {
            res.redirect(serverSettings.host);
        }
    });
});



const server = app.listen(serverSettings.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://', host, port);
});
