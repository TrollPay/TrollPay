var Promise = require('bluebird');
var Mongoose = require('mongoose');
var _ = require('underscore');

// The Payment model
var PaymentSchema = require('./PaymentSchema.js');
var Payment = Mongoose.model('Payment', PaymentSchema);

/**
 * addNewPayment creates a new Payment document and adds it to the collection.
 *
 * @param {Object} properties An object with all the properties on the schema, except the defaults.
 */
module.exports.addNewPayment = function(properties) {

  // Attach defaults
  // TODO: DO THIS CLIENT SIDE
  _.extend(properties, {
    isCancelled: false,
    created_at: new Date().toISOString(),
    balance: properties.total,
    installments: []
  });

  // create new Payment document
  var newPayment = Payment(properties);

  return new Promise(function(resolve, reject) {
    newPayment.save(function(err, payment) {
      if (err) {
        console.log('Could not add new payment');
        reject(err);
      } else {
        console.log('Payment added');
        resolve(payment);
      }
    });
  });

};

/**
 * processPayments calls the Venmo API on each Payment document in the system
 */
module.exports.processPayments = function(callback) {

};

/**
 * cancelPayment voids a Payment by setting its isCancelled property to TRUE
 *
 * @param {Number} id Payment ID
 */
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
        } else if (result.nModified < 1) {
          console.log('Payment is already cancelled');
          resolve(result);
        } else {
          console.log('Payment cancelled');
          resolve(result);
        }
      });

  });

};
