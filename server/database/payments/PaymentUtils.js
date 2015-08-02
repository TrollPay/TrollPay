var _ = require('underscore');
var Promise = require('bluebird');
var Mongoose = require('mongoose');

var Utils = require('../../utils.js');
var HashGenerator = require('./HashGenerator.js');

var PaymentSchema = require('./PaymentSchema.js');
var Payment = Mongoose.model('Payment', PaymentSchema);

var noteTemplate = _.template(
  'TrollPay.me (<%= current %> of <%= total %>): <%= note %>'
);

/*
 * createNewPaymentModel
 * Creates a new payment model document.
 */
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
    console.log('localhost:3000/claim/' + HashGenerator.encodeBase64(id, hashes.claim));
    console.log('localhost:3000/untroll/' + HashGenerator.encodeBase64(id, hashes.untroll));
    console.log('localhost:3000/trolltoll/' + HashGenerator.encodeBase64(id, hashes.trolltoll));

    return model;
  }
};

module.exports.updatePayment = function(payment, body) {
  console.log('Updating payment model:', payment.id);
  var installments = module.exports.logInstallment(payment, body);
  payment.set('balance', payment.get('balance') - 1);
  payment.set('installments:', installments);
};

module.exports.makePaymentStub = function(user, payment) {
  return {
    'access_token': user.access_token,
    'email': payment.recipient_email,
    'note': module.exports.makeNote(payment),
    'amount': 1
  };
};

module.exports.makeNote = function(payment) {
  var current = Math.floor(payment.total - payment.balance) + 1;
  var total = Math.floor(payment.total);
  return noteTemplate({
    note: payment.note,
    current: current,
    total: total
  });
};

module.exports.logInstallment = function(payment, body){
  var installments = payment.get('installments');
  var installment = JSON.stringify({
    'id': body.payment.id,
    'amount': body.payment.amount,
    'date_created': body.payment.date_created
  });
  installments.push(installment);
  return installments;
};
