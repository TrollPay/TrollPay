var request = require('request');
var api = require('../../config.js');

var api_secret = process.env.API_SECRET || api.secret;
var app_id = process.env.APP_ID || api.id;

module.exports.getVenmo = function(auth_code, ip, callback) {
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
        body = JSON.parse(body);
        body.ip_log = ip;
        callback(false, body);
      } else {
        callback(true, error);
      }
    });
};
