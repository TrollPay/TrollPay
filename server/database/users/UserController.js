var Promise = require('bluebird');
var Mongoose = require('mongoose');
var needle = require('needle');

var userSchema = require('./UserSchema.js');
var Utils = require('./UserUtils.js');
var User = Mongoose.model('User', userSchema);

var VENMO = require('../../endpoints.js').VENMO;

/*
 * fetchUserFromVenmo
 * Resolves with an object containing a user object property,
 * access token, and refresh token.
 */
module.exports.fetchUserFromVenmo = function(code) {
  console.log('Fetching user from venmo', code);
  return new Promise(function(resolve, reject) {
    needle.post(VENMO.OAUTH, Utils.createVenmoLookupObject(code), cb);
    function cb(err, resp, body) {
      if (err) { reject(err); }
      else { resolve(Utils.createUserObject(body)); }
    }
  });
};

/*
 * lookupSenderByVenmoId
 * Resolves with a user model or null if none is found.
 */
module.exports.lookupSenderByVenmoId = function(venmo_id) {
  console.log('Looking up sender in database:', venmo_id);
  return new Promise(function(resolve, reject) {
    User.findOne({ 'venmo_id': venmo_id }, cb);
    function cb(err, user) {
      if (err) {
        console.log(err);
        reject(err);
      }else if (user) {
        console.log('Sender', venmo_id, 'found!');
        resolve(user);
      }else {
        console.log('Sender', venmo_id, 'does not exist.');
        resolve(null);
      }
    }
  });
};

/*
 * upsertUser
 * Resolves with the venmo id of the upserted user.
 */
module.exports.upsertUser = function(user) {
  console.log('Upserting user', user.venmo_id);
  user = user.toObject();
  return new Promise(function(resolve, reject) {
    User.update({ 'venmo_id': user.venmo_id }, user, { upsert: true }, cb);
    function cb(err, saved) {
      if (err) { reject(err); }
      else { resolve(user); }
    }
  });
};
