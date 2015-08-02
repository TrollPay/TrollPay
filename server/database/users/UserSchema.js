var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  venmo_id: String,
  first_name: String,
  last_name: String,
  email: String,
  phone: String,
  about: String,
  display_name: String,
  venmo_username: String,
  profile_picture_url: String,
  join_date: String,
  venmo_join_date: String,
  access_token: String,
  refresh_token: String,
  ip_log: [String]
});
