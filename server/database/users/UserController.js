var Promise = require('bluebird');
var Mongoose = require('mongoose');
var userSchema = require('./UserSchema.js');

var User = Mongoose.model('User', userSchema);

module.exports.createNewUserModel = function(venmo) {
  return new User({
    venmo_id: venmo.user.id,
    access_token: venmo.access_token,
    refresh_token: venmo.refresh_token,
    first_name: venmo.user.first_name,
    last_name: venmo.user.last_name,
    venmo_username: venmo.user.username,
    display_name: venmo.user.display_name,
    about: venmo.user.about,
    email: venmo.user.email,
    phone: venmo.user.phone,
    profile_picture_url: venmo.user.profile_picture_url,
    venmo_join_date: venmo.user.date_joined
      // ip_log: venmo.ip
  });
};

module.exports.updateUserModel = function(user, update) {
  user.set('access_token', update.access_token);
  user.set('refresh_token', update.refresh_token);
  user.set('first_name', update.user.first_name);
  user.set('last_name', update.user.last_name);
  user.set('venmo_username', update.user.username);
  user.set('display_name', update.user.display_name);
  user.set('about', update.user.about);
  user.set('email', update.user.email);
  user.set('phone', update.user.phone);
  user.set('profile_picture_url', update.user.profile_picture_url);
  user.save();
  return user;
};

module.exports.getUserByVenmoId = function(venmo_id) {
  return new Promise(function(resolve, reject) {
    User.findOne({
      'venmo_id': venmo_id
    }, function(err, user) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else if (user) {
        console.log('User', venmo_id, 'found!');
        resolve(user);
      }
      else {
        console.log('User', venmo_id, 'does not exist.');
        resolve(null);
      }
    });
  });
};

module.exports.upsertUser = function(user) {
  var upserted = user.toObject();
  return new Promise(function(resolve, reject) {
    User.update({
        venmo_id: upserted.venmo_id
      }, upserted, {
        upsert: true
      },
      function(err, saved) {
        if (err) {
          console.log('Could not upsert user');
          reject(err);
        }
        else {
          console.log('User upserted');
          resolve(saved);
        }
      });
  });
};
