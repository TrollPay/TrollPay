var http = require('http');
var api = require('./config.js');

function getToken(auth_code) {
  var post_data = {
    "client_id": api.id,
    "client_secret": api.secret,
    "code": auth_code
  };

  var post_options = {
    host: 'https://api.venmo.com/v1/oauth/access_token',
    method: 'POST'
  }

}