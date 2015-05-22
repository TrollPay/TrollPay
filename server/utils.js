var request = require('request');
var api = require('./config.js');

var api_secret = process.env.API_SECRET || api.secret;
var app_id = process.env.APP_ID || api.id;

function getToken(auth_code, callback) {
  request.post(
    'https://api.venmo.com/v1/oauth/access_token',
    {
      form: {
        client_id: app_id,
        client_secret: api_secret,
        code: auth_code
      }
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
          callback(body)
      }
    }
  )
}

module.exports.getToken = getToken;