/******************************** NPM MODULES *********************************/

var Promise = require('bluebird');
var Mongoose = Promise.promisifyAll(require('mongoose'));
var _ = require('underscore');

/******************************* GLOBAL IMPORTS *******************************/

var Utils = require('./EmailUtils.js');
var PaymentSchema = require('../payments/PaymentSchema.js');
var Payment = Mongoose.model('Payment', PaymentSchema);

var UserController = require('../users/UserController.js');

/******************************* PUBLIC METHODS *******************************/

/*
 * sendWelcomeEmails
 * Sends the welcome email to the sender and the recipient.
 */
module.exports.sendWelcomeEmails = function(sender, payment){
  var promises = [
    Utils.getTrollEmail(sender, payment),
    Utils.getVictimEmail(sender, payment)
  ];
  Promise.all(promises)
  .then(function(emails){
    return Promise.all(emails.map(Utils.sendEmail));
  });
};

/*
 * sendDailyEmails
 * Sends the daily email out to victims in the payment collection where valid.
 */
module.exports.sendDailyEmails = function(){
  findValidPayments()
  .then(sendEmails);

  function findValidPayments(){
    return Payment.find({}).where('balance').gt(0).execAsync();
  }

  function sendEmails(payments){
    var promises = payments.map(function(payment){
      return UserController.lookupSenderById(payment.sender_id)
      .then(function(sender){ return Utils.getVictimEmail(sender, payment); });
    });

    Promise.all(promises).then(function(emails){
      return Promise.all(emails.map(Utils.sendEmail));
    });

  };

};
