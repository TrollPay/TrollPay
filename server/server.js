// Default Modules
var Url = require('url'); // https://nodejs.org/api/url.html

// NPM Modules
var express = require('express');
var mongoose = require('mongoose');

// Local Modules
var api = require('./config.js');
var routes = require('./routes.js');

// Set environment variables
var api_secret = process.env.API_SECRET || api.secret;
var app_id = process.env.APP_ID || api.id;
var mongo_host = process.env.MONGO_HOST || 'mongodb://localhost/test';

// Connect to MongoDB
mongoose.connect(mongo_host);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB.');
});

// Instantiate the express object
var app = express();

// Use the static assets from the client directory
app.use(express.static(path.resolve("../client")));

// GET Requests
app.get('/confirm', routes.confirm);
app.get('/login', routes.login);
app.get('/', function(req, res) {

  // Check cookie for current user
  // decrypt ID to see if user exists in collection
  //
  // user exists:
  // redirect to: /dashboard
  // else
  // show form

  console.log(req.url);

  if (req.url.search('code') > -1) {
    var auth_code = req.url.substr(7);
    utils.getToken(auth_code, function(body) {
      var response = body;
      response_dict = JSON.parse(body);
      console.log(response_dict);
      res.send("<img src=" + response_dict.user.profile_picture_url + " />");

    });
    //you could res.send the body outside of the utils function
    //TODO: Import our mongo database and use it here to store our initial data about the user
  } else {
    res.sendFile('index.html', { root: path.join(__dirname, '../client') });
  }

});

app.get('dist/vendor/react-with-jsxtransformer.min.js', function(req, res) {
  res.sendFile('./dist/vendor/react-with-jsxtransformer.min.js');
});

// app.get('dist/vendor/bootstrap-with-npm.min.js', function(req, res) {
//   res.sendFile('./dist/vendor/bootstrap-with-npm.min.js');
// });

app.get('/dist/vendor/bootstrap.min.css', function(req, res) {
  console.log('in here')
  res.sendFile(path.join(__dirname, '../client/dist/vendor','bootstrap.min.css'));
});

app.get('css/style.css', function(req, res) {
  res.sendFile('/dist/lib.min.js');
});

// Start the server
var port = process.env.PORT || 3000;

var server = app.listen(port, function() {
  //var host = server.address().address;

  console.log('Listening on port:', port);
});
