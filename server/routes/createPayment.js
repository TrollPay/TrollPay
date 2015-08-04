/******************************* GLOBAL IMPORTS *******************************/

var EmailController = require('../database/emails/EmailController.js');
var PaymentController = require('../database/payments/PaymentController.js');
var UserController = require('../database/users/UserController.js');
var UserUtils = require('../database/users/UserUtils.js');
var Utils = require('../utils.js');

/******************************* PUBLIC METHODS *******************************/

/*
 * createPayment
 * Adds a payment to the collection, updates the user document, sends emails.
 */
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
    .then(addPayment)
    .then(sendEmails)
    .then(function(){
      res.send('Done');
    })
    .catch(function(error) {
      console.log(error);
    });

  function tradeCodeForVenmoData(code){
    console.log('trading code for venmo data');
    return UserController.fetchUserFromVenmo(code);
  }

  function lookupSenderByVenmoId(venmo_data) {
    console.log('looking up sender by venmo id');
    venmo = venmo_data;
    return UserController.lookupSenderByVenmoId(venmo.user.id);
  }

  function storeUserVenmoData(user) {
    if (!user){ user = UserUtils.createNewUserModel(venmo, ip); }
    else{ user = UserUtils.updateUserModel(user, venmo, ip); }
    return UserController.upsertUser(user);
  }

  function addPayment(user) {
    console.log('sender', user);
    return PaymentController.addPayment(payment, user);
  }

  function sendEmails(details){
    return EmailController.sendWelcomeEmails(details.sender, details.payment);
  }

};
