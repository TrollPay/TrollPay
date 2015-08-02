var Promise = require('bluebird');

var Utils = require('./EmailUtils.js');

module.exports.sendWelcomeEmails = function(sender, recipient){
  var emails = [
    Utils.getTrollWelcomeEmail(sender),
    Utils.getVictimWelcomeEmail(recipient)
  ];
  return Promise.all(emails.map(Utils.sendEmail));
};

/*
 * processPayments
 * Calls processPayment on each payment in the database.
 */
module.exports.processPayments = function() {
  return new Promise(function(resolve, reject) {
    Payment.find({}, cb);
    function cb(err, payments) {
      if (err) { reject(err); }
      else {
        payments = payments.filter(filter);
        payments = payments.map(module.exports.processPayment);
        resolve(Promise.all(payments));
       }
    }
    function filter(payment){
      return !(payment.get('cancelled') ||
        payment.get('untrolled') ||
        payment.get('trollTolled'));
    }
  });
};
