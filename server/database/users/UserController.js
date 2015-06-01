var Promises = require('bluebird');
var Mongoose = require('mongoose');
var userSchema = require('./UserSchema.js');

var User = Mongoose.model('User', userSchema);

module.exports.insertNewUser = function(newUser, callback) {
  User.findOne({
    venmo_id: newUser.venmo_id
  }, function(err, user) {
    if (user) {
      console.log('WARNING: User already exists.');
      callback(false, user);
    } else {
      newUser.save(function(err, user) {
        if (err) {
          console.log('ERROR: Could not add new user');
          callback(true, err);
        } else {
          console.log('SUCCESS: New user added');
          callback(false, user);
        }
      });
    }
  });
};

module.exports.createNewUser = function(venmo) {
  return new User({
    venmo_id: venmo.user.id,
    access_token: venmo.access_token,
    refresh_token: venmo.refresh_token,
    first_name: venmo.user.first_name,
    last_name: venmo.user.last_name,
    display_name: venmo.user.display_name,
    about: venmo.user.about,
    email: venmo.user.email,
    phone: venmo.user.phone,
    profile_picture_url: venmo.user.profile_picture_url,
    venmo_join_date: venmo.user.data_joined,
    ip_log: venmo.ip_log
  });
};
