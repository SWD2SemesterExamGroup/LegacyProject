const express = require('express'); // Express to set up path ways
let app = express(); // Initiate
let cors = require('cors'); // Cors is used for ??
var reload = require('require-reload')(require);

const port = 4444;
app.use(express.static("."));
app.use(express.static(__dirname + '/views/'));
app.use(cors());
app.set('view engine', 'ejs');
app.listen(process.env.PORT || port, () => {
    console.log('We are live on ' + port);
    console.log("Process env Port: " + process.env.PORT);
});

app.get('/', function(req, res, next) {
    res.render('./index.html');
});
app.get('/content', function(req, res, next) {
    res.sendFile('./views/contentEvents.html');
});
app.get('/links', function(req, res, next) {
    res.sendFile('./views/links.html');
});

// Call path to send message to ActiveMQ
app.get('/getdata', function(req, res, next) {
    var prod = reload('./producer.js');

    res.status(200).json({
        success: true,
        message: 'Data updated'
    });
    prod = null;
});