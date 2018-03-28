const path = require('path');
const fs = require('fs');
const q = require('q');
const dbSettings = require('./../config/settings').database;
let connection = null;
const db = {};

db.connect = function(){
    const dbFile = path.normalize(path.join(__dirname, dbSettings.name));
    const dbExists = fs.existsSync(dbFile);
    const sqlite3 = require('sqlite3').verbose();

    if (dbExists) {
        connection = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (error) => {
            if (error) {
                return console.error(err.message);
            }
            console.log('Connected to the ' + dbSettings.name + ' SQlite database.');
        });
    }

};

db.createTable = function() {
    let deffered = q.defer();
    const query = 'CREATE TABLE IF NOT EXISTS urls(longUrl text NOT NULL)';
    connection.serialize(function() {
        connection.run(query, function (error, result) {
            if (error) {
                deffered.resolve({status: 'error', msg: error, source: 'db.createTable'});
            }
            deffered.resolve({status: 'success', result: result, source: 'db.createTable'});
        });
    });

    return deffered.promise;

};

db.selectByLongUrl = function(longUrl){
    let deffered = q.defer();
    const query = 'SELECT rowid, longUrl FROM urls WHERE longUrl=?';
    connection.serialize(function () {
        connection.all(query, [longUrl], function (error, result) {

            if (error) {
                deffered.resolve({status: 'error', msg: error, source: 'db.selectByLongUrl'});
            }

            deffered.resolve({status: 'success', result: result, source: 'db.selectByLongUrl'});
        });
    });
    return deffered.promise;
};

db.getMaxId = function(){
    let deffered = q.defer();
    const query = 'SELECT MAX(rowid) AS id FROM urls';
    connection.all(query, function (error, result) {
        if (error) {
            deffered.resolve({status: 'error', msg: error, source: 'db.getMaxId'});
        }

        deffered.resolve({status: 'success', result: result, source: 'db.getMaxId'});
    });

    return deffered.promise;
};

db.insert = function(params, values){
    let deffered = q.defer();
    const insert = `INSERT INTO urls (${params}) VALUES ('${values}')`;
    connection.all(insert, function (error, result) {
        if (error) {
            deffered.resolve({status: 'error', msg: error, source: 'db.insert'});
        }

        deffered.resolve({status: 'success', result: result, source: 'db.insert'});
    });
    return deffered.promise;
};

db.selectByID = function(id) {
    let deffered = q.defer();
    const query = 'SELECT * FROM urls WHERE rowid=?';
    connection.serialize(function() {
        connection.all(query, [id], function (error, result) {
            if (error) {
                deffered.resolve({status: 'error', msg: error, source: 'db.selectByID'});
            }
            deffered.resolve({status: 'success', result: result, source: 'db.selectByID'});
        });
    });

    return deffered.promise;
};

db.close = function(){
    connection.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
};

module.exports = db;