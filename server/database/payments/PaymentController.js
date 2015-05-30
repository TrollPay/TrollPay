var mongoose = require('mongoose');
var _ = require('underscore');
var paymentSchema = require('./PaymentSchema.js');

// The Payment model
var Payment = mongoose.model('Payment', paymentSchema);

/**
 * addNewPayment creates a new Payment document and adds it to the collection.
 *
 * @param {Object} properties An object with all the properties on the schema, except the defaults.
 */
module.exports.addNewPayment = function(properties, callback) {

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

  // Saves the Payment document
  newPayment.save(function(err, payment) {
    if (err) {
      console.log('ERROR: Could not add new payment');
      callback(true, err);
    } else {
      console.log('SUCCESS: Payment added');
      callback(false, payment);
    }
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
module.exports.cancelPayment = function(id, callback) {

  Payment.update({
    '_id': id
  }, {
    'isCancelled': true
  }, function(err, result) {
    if (err) {
      console.log('ERROR: Could not cancel payment');
      callback(true, err);
    } else if (result.nModified < 1) {
      console.log('WARNING: Payment is already cancelled');
      callback(false, result);
    } else {
      console.log('SUCCESS: Payment cancelled');
      callback(false, result);
    }
  });

};
