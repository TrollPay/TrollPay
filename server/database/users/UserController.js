var mongoose = require('mongoose');
var userSchema = require('./UserSchema.js');

module.exports.User = mongoose.model('User', userSchema);

module.exports.addNewUser = function(obj) {

  // TODO: encrypt the user data object

  var newUser = new module.exports.User(obj);
  newUser.save();
};
