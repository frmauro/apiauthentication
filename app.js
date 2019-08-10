var express = require('express');
var app = express();
var db = require('./db');


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

var UserController = require('./user/UserController');
app.use('/users', UserController);

module.exports = app;