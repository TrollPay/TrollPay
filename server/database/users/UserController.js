var Promise = require('bluebird');
var Mongoose = require('mongoose');
var needle = require('needle');

var userSchema = require('./UserSchema.js');

var User = Mongoose.model('User', userSchema);

// Sets environment variables
var api_secret = process.env.API_SECRET;
var app_id = process.env.APP_ID;

/*
 * createNewUserModel
 * Creates a new user model document.
 */
module.exports.createNewUserModel = function(venmo, ip) {
  console.log('Creating new user model:', venmo.user.id);
  var join_date = new Date();
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
    venmo_join_date: venmo.user.date_joined,
    join_date: join_date.toISOString(),
    ip_log: ip
  });
};

/*
 * updateUserModel
 * Returns an updated user model document.
 */
module.exports.updateUserModel = function(user, update, ip) {
  console.log('Updating user model:', user.venmo_id);
  var ip_log = user.get('ip_log');
  ip_log.push(ip);
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
  user.set('ip_log', ip_log);
  return user;
};

/*
 * fetchUserFromVenmo
 * Resolves with an object containing a user object property,
 * access token, and refresh token.
 */
module.exports.fetchUserFromVenmo = function(code) {
  console.log('Fetching user from venmo', code);
  return new Promise(function(resolve, reject) {
    var url = 'https://api.venmo.com/v1/oauth/access_token';
    var data = {
      'client_id': app_id,
      'client_secret': api_secret,
      'code': code
    };

    needle.post(url, data, function(err, resp, body) {
      if (err) {
        reject(err);
      }
      else {
        var venmo = {
          user: body.user,
          access_token: body.access_token,
          refresh_token: body.refresh_token
        };
        resolve(venmo);
      }
    });
  });
};

/*
 * getUserByVenmoId
 * Resolves with a user model or null if none is found.
 */
module.exports.getUserByVenmoId = function(venmo_id) {
  console.log('Looking up user in database:', venmo_id);
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

/*
 * upsertUser
 * Resolves with the venmo id of the upserted user.
 */
module.exports.upsertUser = function(user) {
  user = user.toObject();
  return new Promise(function(resolve, reject) {
    User.update({
        venmo_id: user.venmo_id
      },
      user, {
        upsert: true
      },
      function(err, saved) {
        if (err) {
          reject(err);
        }
        else {
          resolve(user.venmo_id);
        }
      });
  });
};
