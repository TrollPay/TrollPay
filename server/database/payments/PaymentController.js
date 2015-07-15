var Promise = require('bluebird');
var Mongoose = require('mongoose');
var _ = require('underscore');

// The Payment model
var PaymentSchema = require('./PaymentSchema.js');
var Payment = Mongoose.model('Payment', PaymentSchema);

module.exports.createNewPaymentModel = function(payment, sender_id) {
  console.log('Creating a new payment:', sender_id);
  var timestamp = new Date();

  return new Payment({
    sender_id: sender_id,
    recipient_email: payment.recipient_email,
    note: payment.note,
    isCancelled: false,
    created_at: timestamp.toISOString(),
    total: payment.total,
    balance: payment.total,
    installments: []
  });
};

module.exports.addNewPayment = function(payment) {

  return new Promise(function(resolve, reject) {
    payment.save(function(err, payment) {
      if (err) {
        console.log('Could not add new payment', err);
        reject(err);
      }
      else {
        console.log('Payment added', payment);
        resolve(payment);
      }
    });
  });

};

module.exports.processPayments = function(callback) {

};

module.exports.cancelPayment = function(id) {
  return new Promise(function(resolve, reject) {
    Payment.update({
        '_id': id
      }, {
        'isCancelled': true
      },
      function(err, result) {
        if (err) {
          console.log('Could not cancel payment');
          reject(err);
        }
        else if (result.nModified < 1) {
          console.log('Payment is already cancelled');
          resolve(result);
        }
        else {
          console.log('Payment cancelled');
          resolve(result);
        }
      });

  });

};
