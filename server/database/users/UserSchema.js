var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  user_id: String,  // encrypted
  access_token: String,
  refresh_token: String,
  first_name: String,
  last_name: String,
  display_name: String,
  about: String,
  email: String,
  phone: String,
  profile_picture_url: String,
  date_joined: Date
});
