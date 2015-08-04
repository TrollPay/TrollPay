/******************************* CONSTANT TYPES *******************************/

var ISO_DATE = require('../../utils.js').REGEX.ISO_DATE;
var ACTION = require('../../utils.js').ACTION;

/******************************** NPM MODULES *********************************/

var Promise = require('bluebird');
var Mongoose = Promise.promisifyAll(require('mongoose'));
var _ = require('underscore');

/****************************** GLOBAL IMPORTS ********************************/

var UserController = require('../users/UserController.js');
var PaymentSchema = require('./PaymentSchema.js');
var Payment = Mongoose.model('Payment', PaymentSchema);
var PaymentUtils = require('./PaymentUtils.js');
var PaymentStubGenerator = require('./PaymentStubGenerator.js');

/******************************* PUBLIC METHODS *******************************/

/*
 * addPayment
 * Resolves with the payment document that was inserted into the database.
 */
module.exports.addPayment = function(venmo, sender) {
  return PaymentUtils.createNewPaymentModel(venmo, sender).then(savePayment);
  function savePayment(model){
    return model.saveAsync().then(function(result){
      return {'sender': sender, 'payment': model };
    });
  }
};

/*
 * claimPayment
 * Processes a claim and resolves with the updated payment document.
 */
module.exports.claimPayment = function(id, hash){
  var payment = null;

  return getPayment(id)
    .then(isValidAction)
    .then(processClaim);

  function getPayment(id){
    return Payment.findByIdAsync(id).then(function(doc){
      payment = doc;
      return { 'payment': payment, 'action': ACTION.CLAIM, 'hash': hash };
    });
  }
  function processClaim(claimable){
    if(!claimable){ return null; }
    return processPayment(payment, hash, ACTION.CLAIM);
  }
};

/*
 * cancelPayment
 * Resolves with the payment document that was cancelled in the database.
 */
module.exports.cancelPayment = function(id) {
  var payment = null;

  return getPayment(id)
  .then(isValidAction)
  .then(processCancellation);

  function getPayment(id){
    return Payment.findByIdAsync(id).then(function(doc){
      payment = doc;
      return { 'payment': payment, 'action': ACTION.CANCEL };
    });
  }
  function processCancellation(cancellable){
    if(!cancellable){ return null; }
    return PaymentUtils.updatePayment(payment, null, null, ACTION.CANCEL);
  }
};

/****************************** PRIVATE METHODS *******************************/

/*
 * isValidAction
 * Returns TRUE if the action can be performed on the payment document.
 */
var isValidAction = function(options){
  var action = options.action;
  var value = options.payment.get(action.toLowerCase());

  if(action === ACTION.CLAIM){
    var claims = options.payment.get('claims');
    if(!claims || claims.indexOf(options.hash) === -1) { return false; }
    else{ return true; }
  }
  else if(action === ACTION.CANCEL){
    var valid = value ? !ISO_DATE.test(value) : false;
    return valid;
  }
};

/*
 * processPayment
 * Sends money through Venmo then updates the payment document.
 */
var processPayment = function(payment, hash, type) {
    return UserController.lookupSenderById(payment.sender_id)
      .then(makePaymentStub)
      .then(PaymentUtils.sendPayment)
      .then(updatePayment);

  function makePaymentStub(user){
    console.log(user);
    return PaymentStubGenerator.makeStub(user, payment, type);
  }

  function updatePayment(body) {
    return PaymentUtils.updatePayment(payment, body, hash, type);
  }
};
