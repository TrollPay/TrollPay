var Url = require('url'); // https://nodejs.org/api/url.html

// Local Modules
var routes = require('./routes.js');
var PaymentController = require('./database/payments/PaymentController.js');
var UserController = require('./database/users/UserController.js');
var UserUtils = require('./database/users/UserUtils.js');

// Set environment variables
var api_secret = process.env.API_SECRET;
var app_id = process.env.APP_ID;

module.exports.fetchUser = function(req, res) {
  //make the call to venmo api here and send back data on res
  var data = {
    client_id: app_id,
    client_secret: api_secret,
    code: req.code
  }
  var url = 'https://api.venmo.com/v1/users/:user_id?access_token=' + code;
  $.ajax({
    url: url,
    type: "POST",
  })
}

module.exports.createPayment = function(req, res) {
  //TODO: Store in database
  console.log("server received", req.body.payment);

  PaymentController.addNewPayment(req.body.payment)
    .then(function(payment) {
      console.log("payment saved:", payment);
      res.send("Done");
    })
    .catch(function(err) {
      console.log(err);
    });
}

module.exports.confirm = function(req, res) {
  console.log('on the confirm page');
  var url = Url.parse(req.url, true);
  var auth_code = url.query.code;
  if (!auth_code) {
    console.log('No auth_code provided on url');
    res.send('Bad Venmo credentials');
    return;
  }
  var ipAddress = req.connection.remoteAddress;

  UserUtils.getVenmo(auth_code, ipAddress)
    .then(UserController.createNewUser)
    .then(UserController.insertNewUser)
    .then(function(user) {
      res.send('Saved Venmo credentials!');
    })
    .catch(function(error) {
      console.log(error);
      res.send('Bad Venmo credentials');
    });
};
