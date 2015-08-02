var VENMO = require('../../endpoints.js');

var _ = require('underscore');
var Promise = require('bluebird');
var Mongoose = Promise.promisifyAll(require('mongoose'));
var needle = require('needle');

var Utils = require('../../utils.js');
var HashGenerator = require('./HashGenerator.js');

var PaymentSchema = require('./PaymentSchema.js');
var Payment = Mongoose.model('Payment', PaymentSchema);


module.exports.createNewPaymentModel = function(payment, sender_id) {
  console.log('Sender ID:', sender_id, 'is creating a new payment');
  var timestamp = new Date();
  var numClaims = Math.floor(payment.total);
  var model = new Payment({
    'sender_id': sender_id,
    'recipient_email': payment.recipient_email,
    'note': payment.note,
    'created_at': timestamp.toISOString(),
    'total': payment.total,
    'balance': payment.total,
    'claimed': [],
    'claims': null,
    'cancelled': false,
    'cancel': null,
    'untrolled': false,
    'untroll': null,
    'troll_tolled': false,
    'troll_toll': null
  });
  var id = model.get('_id');

  return HashGenerator.generateHashes(id, numClaims).then(setHashes);

  function setHashes(hashes){
    model.set('claims', hashes.claims);
    model.set('cancel', hashes.cancel);
    model.set('untroll', hashes.untroll);
    model.set('troll_toll', hashes.trolltoll);

    console.log('localhost:3000/cancel/' + HashGenerator.encodeBase64(id, hashes.cancel));
    console.log('localhost:3000/untroll/' + HashGenerator.encodeBase64(id, hashes.untroll));
    console.log('localhost:3000/trolltoll/' + HashGenerator.encodeBase64(id, hashes.trolltoll));
    hashes.claims.forEach(function(claim){
      console.log('localhost:3000/claim/' + HashGenerator.encodeBase64(id, claim));
    });
    return model;
  }
};

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

module.exports.updatePayment = function(payment, body, hash) {
  console.log('Updating payment model:', payment.get('_id'));
  payment.set('balance', payment.get('balance') - body.data.payment.amount);
  payment.set('claimed', insertClaimLog(payment, body, hash));
  payment.set('claims', removeClaim(payment, hash));
  return payment.saveAsync(function(result){ return payment; });
};

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

var removeClaim = function(payment, hash){
  var claims = payment.get('claims');
  return claims.filter(function(claim){ return claim !== hash; });
};
