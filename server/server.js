// NPM Modules
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Promises = require('bluebird');

// Local Modules
var api = require('./config.js');
var utils = require('./utils.js');
var PaymentController = require('./database/payments/PaymentController.js');

// Promisify Controller
Promises.promisifyAll(PaymentController);

// Get API secret & app id
var api_secret = process.env.API_SECRET || api.secret;
var app_id = process.env.APP_ID || api.id;
var mongo_host = process.env.MONGO_HOST || 'mongodb://localhost/test';

// Instantiate the express object
var app = express();

// Connect to MongoDB
mongoose.connect(mongo_host);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB.');
});

// Use the static assets from the client directory
// app.use(express.static(path.resolve("./client")));

// GET Requests
app.get('/test', function(req, res) {
  console.log(req.url);

  // test adding the new payment asynchronously
  PaymentController.addNewPaymentAsync({
      sender_id: 'senderid',
      recipient_email: 'test@test.com',
      note: 'This is a test',
      total: 1.50
    })
    .then(function(payment) {
      res.send('New Payment ID: ' + payment._id);
    })
    .catch(function(err) {});

  // test cancelling a payment asynchronously
  PaymentController.cancelPaymentAsync('556cbca6dc8f7d531b55f37a')
    .then(function(result) {
      console.log('Cancelled', result.nModified, 'payments');
    })
    .catch(function(err) {});
});

app.get('/login', function(req, res) {
  var url = "https://api.venmo.com/v1/oauth/authorize?client_id=" + app_id + "&scope=make_payments%20access_profile%20access_email%20access_phone%20access_balance&response_type=code";
  res.redirect(url);
});

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
    res.send('Hello World');
  }
});

app.get('dist/vendor/react-with-jsxtransformer.min.js', function(req, res) {
  res.sendFile('./dist/vendor/react-with-jsxtransformer.min.js');
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
