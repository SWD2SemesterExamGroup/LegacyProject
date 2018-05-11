const express = require('express');
let app = express();
let cors = require('cors');
let ejs = require('ejs');
let stomp = require('stompit');
let prod = require('./producer.js');


const port = 8888;
app.use(express.static("."));
app.use(express.static(__dirname + '/views/'));
app.use(cors());
app.set('view engine', 'ejs');
app.listen(port, () => {
    console.log('We are live on ' + port);
});

app.get('/', function(req, res, next) {
    res.sendfile('index.html');

});
app.get('/content', function(req, res, next) {
    res.sendfile('./views/contentEvents.html');

});
app.get('/links', function(req, res, next) {
    res.sendfile('./views/links.html');

});
app.get('/getdata', function(req, res, next) {
    res.render('getdata.ejs', {producer: prod});
});