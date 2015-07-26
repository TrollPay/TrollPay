var mongoose = require('mongoose');

module.exports = new mongoose.Schema({

  id: mongoose.Schema.Types.ObjectId,
  sender_id: String,
  recipient_email: String,
  note: String,
  created_at: Date,
  total: Number,
  balance: Number,
  installments: [String],
  cancelled: String, // false or 'timestamp'
  untrolled: String,  // false or 'timestamp, amount untrolled'
  trollTolled: String, // false or 'timestamp, toll payed'

});
