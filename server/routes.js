var Url = require('url'); // https://nodejs.org/api/url.html
// Local Modules
var api = require('./config.js');
var routes = require('./routes.js');
var PaymentController = require('./database/payments/PaymentController.js');
var UserController = require('./database/users/UserController.js');
var UserUtils = require('./database/users/UserUtils.js');

// Set environment variables
var api_secret = process.env.API_SECRET || api.secret;
var app_id = process.env.APP_ID || api.id;
var mongo_host = process.env.MONGO_HOST || 'mongodb://localhost/test';

module.exports.confirm = function(req, res) {
  var url = Url.parse(req.url, true);
  var auth_code = url.query.code;
  if (!auth_code) {
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

module.exports.login = function(req, res) {
  var url = "https://api.venmo.com/v1/oauth/authorize?client_id=" + app_id + "&scope=make_payments%20access_profile%20access_email%20access_phone%20access_balance&response_type=code";
  res.redirect(url);
};
