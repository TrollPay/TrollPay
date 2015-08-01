var mongoose = require('mongoose');

module.exports = new mongoose.Schema({

  id: mongoose.Schema.Types.ObjectId,
  sender_id: String,

  recipient_email: String,
  note: String,
  created_at: Date,
  total: Number,
  balance: Number,

  claimed: [String],
  claims: [String],

  cancelled: String, // false or 'timestamp'
  cancel: String,

  untrolled: String,  // false or 'timestamp, amount untrolled'
  untroll: String,

  troll_tolled: String, // false or 'timestamp, toll payed',
  troll_toll: String

});
