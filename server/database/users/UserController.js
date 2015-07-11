var Promise = require('bluebird');
var Mongoose = Promise.promisifyAll(require('mongoose'));
var userSchema = require('./UserSchema.js');

var User = Mongoose.model('User', userSchema);

module.exports.createNewUser = function(venmo) {
  return new Promise(function(resolve, reject) {
    resolve(new User({
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
    }));
  });
};

module.exports.getUser = function(user) {
  return new Promise(function(resolve, reject) {
    User.findOne({
      venmo_id: user.venmo_id
    }, function(err, user) {
      if (err) {
        console.log(err);
        reject(err);
      } else if (user) {
        console.log('getUser', true);
        resolve(user);
      } else {
        console.log('getUser', false);
        resolve(null);
      }
    });
  });


};

module.exports.insertNewUser = function(newUser) {
  return new Promise(function(resolve, reject) {
    module.exports.getUser(newUser)
      .then(function(user) {
        if (!user) {
          newUser.save(function(err, saved) {
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
