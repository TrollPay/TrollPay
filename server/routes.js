//Default Modules
var Url = require('url');
var https = require('https');
var needle = require('needle');

// Local Modules
var routes = require('./routes.js');
var PaymentController = require('./database/payments/PaymentController.js');
var UserController = require('./database/users/UserController.js');
var UserUtils = require('./database/users/UserUtils.js');
var Promise = require('bluebird');

// Set environment variables
var api_secret = process.env.API_SECRET;
var app_id = process.env.APP_ID;

module.exports.fetchUser = function(code) {
  return new Promise(function(resolve, reject) {
    var url = "https://api.venmo.com/v1/oauth/access_token";
    var data = {
      "client_id": app_id,
      "client_secret": api_secret,
      "code": code
    };
    needle.post(url, data,
      function(err, resp, body) {
        if (err) {
          reject(err);
        } else {
          resolve({
            user: body.user,
            access_token: body.access_token,
            refresh_token: body.refresh_token
              //ip: ''
          });
        }
      });
  });

};

module.exports.createPayment = function(req, res) {
  module.exports.fetchUser(req.body.code)
    .then(UserController.createNewUser)
    .then(UserController.insertNewUser)
    .then(function(mongoUser) {
      console.log('user created/updated', mongoUser);
    })
    .catch(function(error) {
      console.log(error);
    });
};

module.exports.confirm = function(req, res) {
  console.log('on the confirm page');
  var url = Url.parse(req.url, true);
  var auth_code = url.query.code;
  if (!auth_code) {
    console.log('No auth_code provided on url');
    res.send('Bad Venmo credentials');
    return;
  }
  var ipAddress = req.connection.remoteAddress;

  UserUtils.getVenmo(auth_code, ipAddress)
    .then(UserController.createNewUser)
    .then(UserController.insertNewUser)
    .then(function(user) {
      res.send('Saved Venmo credentials!');
    })
    .catch(function(error) {
      console.log(error);
      res.send('Bad Venmo credentials');
    });
};
