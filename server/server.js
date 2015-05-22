/* *****************
 * Require Imports *
 * *****************/

var express = require('express');
var path = require('path');
var api = require('./config.js');
var utils = require('./utils.js');

/* *************************
 * Get API secret & app id *
 * ************************/


var api_secret = process.env.API_SECRET || api.secret;
var app_id = process.env.APP_ID || api.id;

/* ***********************
 * Initialize Middleware *
 * **********************/

// Instantiate the express object
var app = express();

// Use the static assets from the client directory
// app.use(express.static(path.resolve("./client")));


/* **************
 * GET Requests *
 * **************/

// index.html
app.get('/pay', function(req, res) {
  var url = "https://api.venmo.com/v1/oauth/authorize?client_id="+app_id+"&scope=make_payments%20access_profile%20access_email%20access_phone%20access_balance&response_type=code";
  res.redirect(url);
});

app.get('/', function(req, res) {
  if (req.url.search('code') > -1) {
    var auth_code = req.url.substr(7);
    utils.getToken(auth_code, function(body) {
      var response = body;
      response_dict = JSON.parse(body);
      console.log(response_dict.about);
    });
    //you could res.send the body outside of the utils function
  }
  else {
    console.log(req.url);
    res.send("hello world 2");
  }
})


app.get('dist/vendor/react-with-jsxtransformer.min.js', function(req, res) {
  res.sendFile('./dist/vendor/react-with-jsxtransformer.min.js');
});

app.get('css/style.css', function(req, res) {
  res.sendFile('/dist/lib.min.js');
});

/* ******************
 * Start the server *
 * ******************/

var port = process.env.PORT || 3000;

var server = app.listen(port, function() {
  //var host = server.address().address;

  console.log('Listening on port:', port);
});
