var Mongoose = require('mongoose');

var userSchema = require('./UserSchema.js');
var User = Mongoose.model('User', userSchema);

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

module.exports.createVenmoLookupObject = function(code){
 return {
    'client_id': process.env.APP_ID,
    'client_secret': process.env.API_SECRET,
    'code': code
  };
};

module.exports.createUserObject = function(body){
  return {
    'user': body.user,
    'access_token': body.access_token,
    'refresh_token': body.refresh_token
  };
};
