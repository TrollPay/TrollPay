var request = require('request');
var api = require('../../config.js');
var Promise = require('bluebird');

var api_secret = process.env.API_SECRET || api.secret;
var app_id = process.env.APP_ID || api.id;

module.exports.getVenmo = function(auth_code, ip) {
  return new Promise(function(resolve, reject) {
    request.post(
      'https://api.venmo.com/v1/oauth/access_token', {
        form: {
          client_id: app_id,
          client_secret: api_secret,
          code: auth_code
        }
      },
      function(error, response, body) {
        if (!error && response.statusCode === 200) {
          var venmo = JSON.parse(body);
          console.log('Retrieved data from Venmo:', venmo.user.id);
          resolve(venmo, ip);
        } else {
          console.log('Could not retrieve data from Venmo.');
          reject(error);
        }
      }
    );

  });
};
