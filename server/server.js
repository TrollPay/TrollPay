// Default Modules
var Url = require('url'); // https://nodejs.org/api/url.html
var path = require('path');

// NPM Modules
var express = require('express');
var Mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Local Modules
var routes = require('./routes.js');

// Set environment variables
var api_secret = process.env.API_SECRET;
var app_id = process.env.APP_ID;
var mongo_host = process.env.MONGOLAB_URI;
var port = process.env.PORT;

// Connect to MongoDB
Mongoose.connect(mongo_host);
var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB.');
});

// Instantiate the express object
var app = express();

// Serve static assets automatically (eg: index.html, vendor assets, etc);
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// GET Requests

// POST Requests
app.post('/payment/create', routes.createPayment);
// app.post('/venmo/fetchuser', routes.fetchUser);

// Start the server
var server = app.listen(port, function() {
  console.log('Listening on port:', port);
});
