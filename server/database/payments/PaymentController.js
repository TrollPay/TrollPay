var Promise = require('bluebird');
var Mongoose = require('mongoose');
var _ = require('underscore');
var needle = require('needle');

// The Payment model
var PaymentSchema = require('./PaymentSchema.js');
var Payment = Mongoose.model('Payment', PaymentSchema);

var UserController = require('../users/UserController.js');

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
    isCancelled: false,
    created_at: timestamp.toISOString(),
    total: payment.total,
    balance: payment.total,
    installments: []
  });
};

/*
 * addNewPayment
 * Resolves with the payment document that was inserted into the database.
 */
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

/*
 * processPayments
 *
 */
module.exports.processPayments = function() {
  return new Promise(function(resolve, reject) {
    Payment.find({}, function(err, payments) {
      if (err) {
        reject(err);
      }
      else {
        var promises = payments.map(_processPayment);
        resolve(Promise.all(promises));
      }
    });
  });

  function _processPayment(payment) {
    return UserController.getUserByVenmoId(payment.sender_id)
      .then(function(user) {
        return {
          'access_token': user.access_token,
          'email': payment.recipient_email,
          'note': payment.note,
          'amount': 1
        };
      })
      .then(module.exports.sendPayment)
      .then(module.exports.updatePayment);
  }
};

/*
 * sendPayment
 * Resolves with the response body from sending payment.
 */
module.exports.sendPayment = function(properties) {
  console.log('Sending payment to:', properties.email);
  var url = 'https://sandbox-api.venmo.com/v1/payments'; //changed for testing from 'https://api.venmo.com/v1/payments';
  return new Promise(function(resolve, reject) {
    needle.post(url, properties, function(err, resp, body) {
      if (err) {
        reject(err);
      }
      else {
        console.log('payment body:', body);
        resolve(body);
      }
    });
  });
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
