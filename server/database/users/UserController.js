var Promise = require('bluebird');
var Mongoose = Promise.promisifyAll(require('mongoose'));
var userSchema = require('./UserSchema.js');

var User = Mongoose.model('User', userSchema);

module.exports.createNewUser = function(venmo, ip) {
  return new Promise(function(resolve, reject) {
    resolve(new User({
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
      ip_log: ip
    }));
  });
};

module.exports.getUser = function(id) {
  return new Promise(function(resolve, reject) {
    User.findOne({
      venmo_id: id
    }, function(err, user) {
      if (err) reject(err);
      else if (user) {
        console.log('User found');
        resolve(user);
      } else {
        console.log('User not found');
        resolve(null);
      }
    });
  });
};

module.exports.insertNewUser = function(newUser) {
  return new Promise(function(resolve, reject) {
    module.exports.getUser(newUser.venmo_id)
      .then(function(user) {
        if (!user) {
          User.save(function(err, saved) {
            if (err) {
              console.log('Could not save new user');
              reject(err);
            } else {
              console.log('New User inserted');
              resolve(saved);
            }
          });
        } else {
          console.log('User already exists.');
          resolve(user);
        }
      })
      .catch(function(error) {
        reject(error);
      });
  });
};
