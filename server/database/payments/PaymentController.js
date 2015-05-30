var mongoose = require('mongoose');
var _ = require('underscore');
var paymentSchema = require('./PaymentSchema.js');

// The Payment model
var Payment = mongoose.model('Payment', paymentSchema);

/**
 * addNewPayment creates a new Payment document and adds it to the collection.
 *
 * @param {Object} properties An object with all the properties on the schema, except the defaults.
 *
 */
module.exports.addNewPayment = function(properties) {

  // Attach defaults
  _.extend(properties, {
    isCancelled: false,
    created_at: new Date().toISOString()
  });

  var newPayment = Payment(properties);
  newPayment.save();
};

/**
 * processPayments calls the Venmo API on each Payment document in the system
 */
module.exports.processPayments = function() {

};

/**
 * cancelPayment voids a Payment by setting its isCancelled property to TRUE
 */
module.exports.cancelPayment = function(id) {

};
