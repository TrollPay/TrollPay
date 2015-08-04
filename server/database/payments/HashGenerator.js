/****************************** CONSTANT TYPES ********************************/

var NUM_ROUNDS = 10;
var SECRET = {
  CANCEL: process.env.CANCEL,
  CLAIM: process.env.CLAIM
};

/******************************** NPM MODULES *********************************/

var Promise = require('bluebird');
var _ = require('underscore');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var Base64 = require('js-base64').Base64;

/****************************** PUBLIC METHODS ********************************/

module.exports.generateHashes = function(id, num_claims){
  return new Promise(function(resolve, reject){
    var hashes = {};
    var promises = [];

    promises.push(generateCancel(id).then(setCancel));
    promises.push(generateClaims(id, num_claims).then(setClaims));

    Promise.all(promises).then(function(array){ resolve(hashes); });

    function setCancel(cancel){ hashes.cancel = cancel; }
    function setClaims(claims){ hashes.claims = claims; }
  });
};

module.exports.checkHash = function(key, id, hash){
  var secret = SECRET[key] + id;
  return bcrypt.compareAsync(secret, hash);
};

module.exports.encodeBase64 = function(id, hash){
  return Base64.encode(id + ":" + hash);
};

module.exports.decodeBase64 = function(encoded){
  return Base64.decode(encoded).split(':');
};

/****************************** PRIVATE METHODS *******************************/

var generateCancel = function(id){
  return bcrypt.hashAsync(SECRET.CANCEL + id, NUM_ROUNDS);
};

var generateClaims = function(id, num){
  var claims = _.range(num).map(function(claim){
    return bcrypt.hashAsync(SECRET.CLAIM + id, NUM_ROUNDS);
  });
  return Promise.all(claims);
};
