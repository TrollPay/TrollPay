var REGEX = require('../../utils.js').REGEX;

var Promise = require('bluebird');
var Mongoose = Promise.promisifyAll(require('mongoose'));
var _ = require('underscore');

var UserController = require('../users/UserController.js');

var PaymentSchema = require('./PaymentSchema.js');
var Payment = Mongoose.model('Payment', PaymentSchema);

var PaymentUtils = require('./PaymentUtils.js');
var PaymentStubGenerator = require('./PaymentStubGenerator.js');

/*
 * addPayment
 * Resolves with the payment document that was inserted into the database.
 */
module.exports.addPayment = function(venmo, sender_id) {
  return PaymentUtils.createNewPaymentModel(venmo, sender_id).then(savePayment);
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
    return cancel ? REGEX.ISO_DATE.test(cancel) : false;
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
 * claimPayment
 * Processes a claim and resolves with the updated payment document.
 */
module.exports.claimPayment = function(id, hash){
  var payment = null;

  return getPayment(id)
    .then(canClaim)
    .then(processClaim);

  function getPayment(id){
    console.log('getting payment claim:', hash);
    return Payment.findByIdAsync(id).then(function(doc){ payment = doc; });
  }

  function canClaim(){
    var claims = payment.get('claims');
    if(!claims){ return false; }
    if(claims.indexOf(hash) === -1) { return false; }

    return true;
  }

  function processClaim(claimable){
    if(!claimable){ console.log('not claimable'); return payment; }
    else{
      var timestamp = new Date();
      return processPayment(payment, hash);
    }
  }};

/*
 * processPayment
 * Sends money through Venmo then updates the payment document.
 */
var processPayment = function(payment, hash) {
  return UserController.lookupSenderByVenmoId(payment.sender_id)
    .then(makePaymentStub)
    .then(PaymentUtils.sendPayment)
    .then(updatePayment);

  function makePaymentStub(user){
    return PaymentStubGenerator.makeStub(user, payment);
  }

  function updatePayment(body) {
    return PaymentUtils.updatePayment(payment, body, hash);
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

