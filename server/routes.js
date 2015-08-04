var ACTION = require('./utils.js').ACTION;

// Default Modules
var Url = require('url');
var https = require('https');
var Promise = require('bluebird');

// Local Modules
var routes = require('./routes.js');
var EmailController = require('./database/emails/EmailController.js');
var PaymentController = require('./database/payments/PaymentController.js');
var UserController = require('./database/users/UserController.js');
var UserUtils = require('./database/users/UserUtils.js');

var HashGenerator = require('./database/payments/HashGenerator.js');
var Utils = require('./utils.js');

module.exports.updatePayment = function(req, res){
  var key = req.params.key.toUpperCase();
  var lookup = HashGenerator.decodeBase64(req.params.lookup);
  var id = lookup[0];
  var hash = lookup[1];

  HashGenerator.checkHash(key, id, hash)
  .then(processUpdate)
  .then(sendResponse);

  function processUpdate(valid){
    if(valid && key === ACTION.CANCEL){
      return PaymentController.cancelPayment(id);
    }
    else if(valid && key === ACTION.CLAIM){
      return PaymentController.claimPayment(id, hash);
    }
    else if(valid && key === ACTION.UNTROLL){
      return PaymentController.untrollPayment(id, hash);
    }
    else{ return null; }
  }

  function sendResponse(payment){
    if(!payment){ res.send('404'); }
    else{ res.send(payment); }
  }
};

module.exports.getwebhook = function(req, res) {
  console.log("got into webhook handler")
  var url = req.query.venmo_challenge;
  res.send(url);
};

module.exports.postwebhook = function(req, res) {
  res.send('POST to /venmowh received');
};

module.exports.createPayment = function(req, res) {

  // Parses values from request body
  var payment = req.body.payment;
  var code = req.body.code;

  // logs the ip and reason
  var ip = Utils.makeIPLog(req.connection.remoteAddress, 'createPayment');

  // stores the updated venmo credentials
  var venmo = null;

  tradeCodeForVenmoData(code)
    .then(lookupSenderByVenmoId)
    .then(storeUserVenmoData)
    .then(addPayment)
    //.then(sendEmails)
    .then(function(){
      res.send('Done');
    })
    .catch(function(error) {
      console.log(error);
    });

  function tradeCodeForVenmoData(code){
    return UserController.fetchUserFromVenmo(code);
  }

  function lookupSenderByVenmoId(venmo_data) {
    venmo = venmo_data;
    return UserController.lookupSenderByVenmoId(venmo.user.id);
  }

  function storeUserVenmoData(user) {
    if (!user)
      user = UserUtils.createNewUserModel(venmo, ip);
    else
      user = UserUtils.updateUserModel(user, venmo, ip);
    return UserController.upsertUser(user);
  }

  function addPayment(sender_id) {
    return PaymentController.addPayment(payment, sender_id);
  }

  function sendEmails(payment){
    var sender = venmo.user.email;
    var recipient = payment.get('recipient_email');
    return EmailController.sendWelcomeEmails(sender, recipient);
  }

};
