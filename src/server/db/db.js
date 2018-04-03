const path = require('path');
const fs = require('fs');
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
    const query = 'CREATE TABLE IF NOT EXISTS urls(longUrl text NOT NULL)';
    return new Promise(function(resolve, reject){
        connection.serialize(function() {
            connection.run(query, function(err, res) {
                if (err) {
                    reject({status: 'error', msg: err, source: 'db.createTable'});
                }
                resolve({status: 'success', result: res, source: 'db.createTable'});
            });
        });
    });
};

db.selectByLongUrl = function(longUrl){
    const query = 'SELECT rowid, longUrl FROM urls WHERE longUrl=?';
    return new Promise(function(resolve, reject){
        connection.serialize(function () {
            connection.all(query, [longUrl], function(err, res) {
                if (err) {
                    reject({status: 'error', msg: err, source: 'db.selectByLongUrl'});
                }
                resolve({status: 'success', result: res, source: 'db.selectByLongUrl'});
            });
        });
    })

};

db.getMaxId = function(){
    const query = 'SELECT MAX(rowid) AS id FROM urls';
    return new Promise(function(resolve, reject){
        connection.run(query, function (error, result) {
            if (error) {
                reject({status: 'error', msg: error, source: 'db.getMaxId'});
            }
            resolve({status: 'success', result: result, source: 'db.getMaxId'});
        });
    });
};

db.insert = function(column, value){
    const insert = `INSERT INTO urls (${column}) VALUES (?)`;
    return new Promise(function(resolve, reject){
        connection.all(insert, value, function (error, result) {
            if (error) {
                reject({status: 'error', msg: error, source: 'db.insert'});
            }
            resolve({status: 'success', result: result, source: 'db.insert'});
        });
    });
};

db.selectByID = function(id) {
    const query = 'SELECT * FROM urls WHERE rowid=?';
    return new Promise(function(resolve, reject){
        connection.serialize(function() {
            connection.get(query, [id], function (error, result) {
                if (error) {
                    reject({status: 'error', msg: error, source: 'db.selectByID'});
                }
                resolve({status: 'success', result: result, source: 'db.selectByID'});
            });
        });
    });
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