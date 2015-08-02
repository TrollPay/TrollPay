// Default Modules
var Url = require('url');
var https = require('https');
var Promise = require('bluebird');

// Local Modules
var routes = require('./routes.js');
var EmailController = require('./database/emails/EmailController.js');
var PaymentController = require('./database/payments/PaymentController.js');
var UserController = require('./database/users/UserController.js');
var UserUtils = require('./database/users/UserUtils.js');

var HashGenerator = require('./database/payments/HashGenerator.js');
var Utils = require('./utils.js');

// TODO: Generalize as updatePayment, to take in key and lookup
module.exports.cancelPayment = function(req, res){
  var lookup = HashGenerator.decodeBase64(req.params.lookup);
  var hash = lookup[0], id = lookup[1];

  HashGenerator.checkHash('CANCEL', id, hash)
  .then(processCancellation)
  .then(sendResponse);

  function processCancellation(valid){
    return valid ? PaymentController.cancelPayment(id) : null;
  }
  function sendResponse(payment){
    if(!payment){ res.send('404'); }
    else{ res.send(payment); }
  }
};

module.exports.test = function(req, res){};

module.exports.createPayment = function(req, res) {

  // Parses values from request body
  var payment = req.body.payment;
  var code = req.body.code;

  // logs the ip and reason
  var ip = Utils.makeIPLog(req.connection.remoteAddress, 'createPayment');

  // stores the updated venmo credentials
  var venmo = null;

  tradeCodeForVenmoData(code)
    .then(lookupSenderByVenmoId)
    .then(storeUserVenmoData)
    .then(addNewPayment)
    //.then(sendEmails)
    .then(function(){
      res.send('Done');
    })
    // .then(PaymentController.processPayments)
    // .then(function(thing) {
    //   console.log('processPayments', thing);
    // })
    // .then(function(payment) {
    //   var data = {
    //     profile_pic: venmo.user.profile_picture_url,
    //     first_name: venmo.user.first_name,
    //     last_name: venmo.user.last_name,
    //     email: venmo.user.email,
    //     payment_total: payment.total
    //   }
    //   res.send(data);
    // })
    .catch(function(error) {
      console.log(error);
    });

  function tradeCodeForVenmoData(code){
    return UserController.fetchUserFromVenmo(code);
  }

  function lookupSenderByVenmoId(venmo_data) {
    venmo = venmo_data;
    return UserController.lookupSenderByVenmoId(venmo.user.id);
  }

  function storeUserVenmoData(user) {
    if (!user)
      user = UserUtils.createNewUserModel(venmo, ip);
    else
      user = UserUtils.updateUserModel(user, venmo, ip);
    return UserController.upsertUser(user);
  }

  function addNewPayment(sender_id) {
    return PaymentController.addNewPayment(payment, sender_id);
  }

  function sendEmails(payment){
    var sender = venmo.user.email;
    var recipient = payment.get('recipient_email');
    return EmailController.sendWelcomeEmails(sender, recipient);
  }

};
