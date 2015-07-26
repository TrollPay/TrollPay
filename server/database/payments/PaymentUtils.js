var _ = require('underscore');
var Mongoose = require('mongoose');

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
  console.log('Creating a new payment:', sender_id);
  var timestamp = new Date();
  return new Payment({
    sender_id: sender_id,
    recipient_email: payment.recipient_email,
    note: payment.note,
    created_at: timestamp.toISOString(),
    total: payment.total,
    balance: payment.total,
    installments: [],
    cancelled: false,
    untrolled: false,
    trollTolled: false,
  });
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
