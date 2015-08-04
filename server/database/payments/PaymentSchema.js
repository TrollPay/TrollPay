var mongoose = require('mongoose');

module.exports = new mongoose.Schema({

  id: mongoose.Schema.Types.ObjectId,
  sender_id: String,
  sender_first_name: String,
  sender_last_name: String,
  recipient_email: String,
  note: String,
  created_at: String,
  total: Number,
  balance: Number,

  claimed: [String],
  claims: [String],

  cancel: String // cancel hash or timestamp of action

});
