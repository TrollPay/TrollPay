var VENMO = require('../../endpoints.js');

var Promise = require('bluebird');
var Mongoose = Promise.promisifyAll(require('mongoose'));
var _ = require('underscore');
var needle = require('needle');

var UserController = require('../users/UserController.js');

var PaymentSchema = require('./PaymentSchema.js');
var Payment = Mongoose.model('Payment', PaymentSchema);

var Utils = require('./PaymentUtils.js');

/*
 * addNewPayment
 * Resolves with the payment document that was inserted into the database.
 */
module.exports.addNewPayment = function(venmo, sender_id) {
  return Utils.createNewPaymentModel(venmo, sender_id).then(savePayment);
  function savePayment(model){
    return model.saveAsync().then(function(result){ return model; });
  }
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

/*
 * processPayment
 * Sends money through Venmo then updates the payment document.
 */
module.exports.processPayment = function(payment) {
  return UserController.lookupSenderByVenmoId(payment.sender_id)
    .then(makePaymentStub);
  //  .then(module.exports.sendPayment)
  //  .then(updatePayment);

  function makePaymentStub(user){
    return Utils.makePaymentStub(user, payment);
  }

  function updatePayment(body) {
    return Utils.updatePayment(payment, body);
  }
};

/*
 * sendPayment
 * Resolves with the response body from sending payment.
 */
module.exports.sendPayment = function(stub) {
  console.log('Sending payment to:', stub.email);
  return new Promise(function(resolve, reject) {
    if(!stub){ reject(null); }
    else { needle.post(VENMO.PAYMENTS, stub, cb); }
    function cb(err, resp, body) {
      console.log('payment body:', body);
      if (err) { reject(err); }
      else { resolve(body); }
    }
  });
};

module.exports.cancelPayment = function(id) {
  var timestamp = new Date();
  return new Promise(function(resolve, reject) {
    Payment.update(
      { '_id': id },
      { 'isCancelled': timestamp.toISOString(),
        'balance': 0 },
      cb);
    function cb(err, result){
      if (err) {
        console.log('Could not cancel payment');
        reject(err);
      } else if (result.nModified < 1) {
        console.log('Payment is already cancelled');
        resolve(result);
      } else {
        console.log('Payment cancelled');
        resolve(result);
      }
    }
  });
};
