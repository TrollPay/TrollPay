/******************************* CONSTANT TYPES *******************************/

var VENMO = require('../../endpoints.js').VENMO;
var ACTION = require('../../utils.js').ACTION;

/******************************** NPM MODULES *********************************/

var _ = require('underscore');
var Promise = require('bluebird');
var Mongoose = Promise.promisifyAll(require('mongoose'));
var needle = require('needle');

/****************************** GLOBAL IMPORTS ********************************/

var Utils = require('../../utils.js');
var HashGenerator = require('./HashGenerator.js');

var PaymentSchema = require('./PaymentSchema.js');
var Payment = Mongoose.model('Payment', PaymentSchema);

/******************************* PUBLIC METHODS *******************************/

/*
 * createNewPaymentModel
 * Returns a new payment model with generated hashes, sender id, and timestamp.
 */
module.exports.createNewPaymentModel = function(payment, sender) {
  console.log('Sender ID:', sender._id, 'is creating a new payment');
  var timestamp = new Date();
  var numClaims = Math.floor(payment.total);
  var model = new Payment({
    'sender_id': sender._id,
    'sender_first_name': sender.sender_first_name,
    'sender_last_name': sender.sender_last_name,
    'recipient_email': payment.recipient_email,
    'note': payment.note,
    'created_at': timestamp.toISOString(),
    'total': payment.total,
    'balance': payment.total,
    'claimed': []
  });
  var id = model.get('_id');

  return HashGenerator.generateHashes(id, numClaims).then(setHashes);

  function setHashes(hashes){
    model.set('claims', hashes.claims);
    model.set('cancel', hashes.cancel);

    console.log('localhost:3000/cancel/' + HashGenerator.encodeBase64(id, hashes.cancel));
    hashes.claims.forEach(function(claim){
      console.log('localhost:3000/claim/' + HashGenerator.encodeBase64(id, claim));
    });
    return model;
  }
};

/*
 * sendPayment
 * Resolves with the return body after sending the stub to Venmo via POST.
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

/*
 * updatePayment
 * Resolves with the updated payment document that was saved to the database.
 */
module.exports.updatePayment = function(payment, body, hash, type) {
  if(type === ACTION.CLAIM){
    console.log('[CLAIM] updating payment id:', payment.get('_id'));
    payment.set('balance', payment.get('balance') - body.data.payment.amount);
    payment.set('claimed', insertClaimLog(payment, body, hash));
    payment.set('claims', filterClaim(payment, hash));
  }
  else{ setPaymentProperties(payment, type); }

  return payment.saveAsync(function(result){ return payment; });
};

/******************************* PRIVATE METHODS ******************************/

/*
 * insertClaimLog
 * Returns a payment modified with the given hash added to the claimed array.
 */
var insertClaimLog = function(payment, body, hash){
  var claimed = payment.get('claimed');
  var claim = JSON.stringify({
    'venmo_payment_id': body.data.payment.id,
    'amount': body.data.payment.amount,
    'date_created': body.data.payment.date_created,
    'hash': hash
  });
  claimed.push(claim);
  return claimed;
};

/*
 * filterClaim
 * Returns the payment's array of claim hashes with the given hash removed.
 */
var filterClaim = function(payment, hash){
  var claims = payment.get('claims');
  return claims.filter(function(claim){ return claim !== hash; });
};

/*
 * setPaymentProperties
 * Modifies the given payment object according to the type.
 */
var setPaymentProperties = function(payment, type){
  var timestamp = new Date();
  if(type === ACTION.CANCEL){ payment.set('cancel', timestamp.toISOString()); }
  payment.set('claims', null);
  payment.set('balance', 0);
};
