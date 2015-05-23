var mongoose = require('mongoose');
var paymentSchema = require('./PaymentSchema.js');

module.exports.Payment = mongoose.model('Payment', paymentSchema);

module.exports.addNewPayment = function(obj) {
  var newPayment = new module.exports.Payment(obj);
  newPayment.save();
};
