var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  sender: {
    venmo_id: String, // encrypt
    access_token: String, // salt/hash
    refresh_token: String, // salt/hash
    first_name: String,
    last_name: String,
    display_name: String,
    about: String,
    email: String,
    phone: String,
    profile_picture_url: String,
    // ip_log: [String]
  },
  recipient_email: String,
  note: String,
  isCancelled: Boolean,
  created_at: Date,
  total: Number,
  balance: Number,
  installments: [Date]
});
