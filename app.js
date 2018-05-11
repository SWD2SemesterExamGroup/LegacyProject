const express = require('express'); // Express to set up path ways
let app = express(); // Initiate
let cors = require('cors'); // Cors is used for ??

const port = 4444;
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

// Call path to send message to ActiveMQ
app.get('/getdata', function(req, res, next) {
    let prod = require('./producer.js');
    prod.produce;
    res.status(200).send('Data Updated');
});