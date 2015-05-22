var mongoose = require('mongoose');

var Troll_Payments = mongoose.Schema({
  sender: String,
  auth_token: String,
  recipient: String,
  payment: {
    total: Number,
    balance: Number,
    beginning: Date,
    installments: [Date]
  }
});

module.exports = mongoose.model('Troll_Payments', Troll_Payments);
