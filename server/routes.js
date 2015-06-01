var Url = require('url'); // https://nodejs.org/api/url.html
var Promises = require('bluebird');
var PaymentController = Promises.promisifyAll(require('./database/payments/PaymentController.js'));
var UserController = Promises.promisifyAll(require('./database/users/UserController.js'));
var UserUtils = Promises.promisifyAll(require('./database/users/UserUtils.js'));

module.exports.confirm = function(req, res) {
  var url = Url.parse(req.url, true);
  var auth_code = url.query.code;
  if (!auth_code) {
    res.send('Bad Venmo credentials');
    return;
  }
  var ipAddress = req.connection.remoteAddress;

  UserUtils.getVenmoAsync(auth_code, ipAddress)
    .then(UserController.createNewUser)
    .then(UserController.insertNewUserAsync)
    .then(function(user) {
      res.send('Saved Venmo credentials!');
    })
    .catch(function(err) {
      console.log('ERROR: Could not get Venmo credentials.');
      res.send('Bad Venmo credentials');
    });
};

module.exports.login = function(req, res) {
  var url = "https://api.venmo.com/v1/oauth/authorize?client_id=" + app_id + "&scope=make_payments%20access_profile%20access_email%20access_phone%20access_balance&response_type=code";
  res.redirect(url);
};
