// Default Modules
var Url = require('url');
var https = require('https');
var Promise = require('bluebird');

// Local Modules
var routes = require('./routes.js');
var PaymentController = require('./database/payments/PaymentController.js');
var UserController = require('./database/users/UserController.js');

module.exports.createPayment = function(req, res) {

  // Parses values from request body
  var payment = req.body.payment;
  var code = req.body.code;

  // logs the ip and reason
  var ip = _makeIPLog(req.connection.remoteAddress, 'createPayment');

  // stores the updated venmo credentials
  var venmo = null;

  UserController.fetchUserFromVenmo(code)
    .then(_lookupUserByVenmo)
    .then(_updateUserVenmoDetails)
    .then(_createPayment)
    .then(PaymentController.addNewPayment)
    .then(PaymentController.processPayments)
    .then(function(thing) {
      console.log('processPayments', thing);
    })
    .then(function(payment) {
      var data = {
        profile_pic: venmo.user.profile_picture_url,
        first_name: venmo.user.first_name,
        last_name: venmo.user.last_name,
        email: venmo.user.email,
        payment_total: payment.total
      }
      res.send(data);
    })
    .catch(function(error) {
      console.log(error);
    });

  function _lookupUserByVenmo(venmo_data) {
    venmo = venmo_data;
    return UserController.getUserByVenmoId(venmo.user.id);
  }

  function _updateUserVenmoDetails(user) {
    if (!user)
      user = UserController.createNewUserModel(venmo, ip);
    else
      user = UserController.updateUserModel(user, venmo, ip);
    return UserController.upsertUser(user);
  }

  function _makeIPLog(ip, reason) {
    var timestamp = new Date();
    var log = {
      timestamp: timestamp.toISOString(),
      ip: ip,
      reason: reason
    };
    return JSON.stringify(log);
  }

  function _createPayment(sender_id) {
    return PaymentController.createNewPaymentModel(payment, sender_id);
  }

};
