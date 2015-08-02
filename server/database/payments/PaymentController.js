var VENMO = require('../../endpoints.js');
var REGEX = require('../../utils.js').REGEX;

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
 * cancelPayment
 * Resolves with the payment document that was cancelled in the database.
 */
module.exports.cancelPayment = function(id) {
  var payment = null;

  return getPayment(id)
  .then(canCancel)
  .then(processCancellation);

  function getPayment(id){
    return Payment.findByIdAsync(id).then(function(doc){ payment = doc; });
  }
  function canCancel(){
    var cancel = payment.get('cancel');
    return cancel ? REGEX.ISO_DATE.test(payment.get('cancel')) : false;
  }
  function processCancellation(cancelled){
    if(cancelled){ return payment; }
    else{
      var timestamp = new Date();
      payment.set('cancel', timestamp.toISOString());
      payment.set('balance', 0);
      payment.set('claims', null);
      payment.set('untroll', null);
      payment.set('troll_toll', null);
      return payment.saveAsync().then(function(result){ return payment; });
    }
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
