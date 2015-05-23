var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  sender_id: String,  // encrypted
  recipient_email: String,
  note: String,
  created_at: Date,
  payment: {
    total: Number,
    balance: Number,
    installments: [Date]
  }
});
