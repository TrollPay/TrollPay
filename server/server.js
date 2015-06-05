// Default Modules
var Url = require('url'); // https://nodejs.org/api/url.html
var path = require('path');

// NPM Modules
var express = require('express');
var Mongoose = require('mongoose');

// Local Modules
var routes = require('./routes.js');

// Set environment variables
var api_secret = process.env.API_SECRET;
var app_id = process.env.APP_ID;
var mongo_host = process.env.DATABASE_URL;

// Connect to MongoDB
Mongoose.connect(mongo_host);
var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(api_secret, 'asdf');
  console.log('Connected to MongoDB.');
});

// Instantiate the express object
var app = express();

// Use the static assets from the client directory
app.use(express.static("client"));

// GET Requests
app.get('/confirm', routes.confirm);
app.get('/login', routes.login);
app.get('/', function(req, res) {

  console.log(req.url);

  res.sendFile('index.html', {
    root: path.join(__dirname, '../client')
  });


});

app.get('dist/vendor/react-with-jsxtransformer.min.js', function(req, res) {
  res.sendFile('./dist/vendor/react-with-jsxtransformer.min.js');
});

// app.get('dist/vendor/bootstrap-with-npm.min.js', function(req, res) {
//   res.sendFile('./dist/vendor/bootstrap-with-npm.min.js');
// });

app.get('/dist/vendor/bootstrap.min.css', function(req, res) {
  console.log('in here')
  res.sendFile(path.join(__dirname, '../client/dist/vendor', 'bootstrap.min.css'));
});

app.get('css/style.css', function(req, res) {
  res.sendFile('/dist/lib.min.js');
});

// Start the server
var port = process.env.PORT;

var server = app.listen(port, function() {
  //var host = server.address().address;

  console.log('Listening on port:', port);
});
