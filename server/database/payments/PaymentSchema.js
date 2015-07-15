var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  sender_id: String,
  recipient_email: String,
  note: String,
  isCancelled: Boolean,
  created_at: Date,
  total: Number,
  balance: Number,
  installments: [String]
});
