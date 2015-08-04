/******************************* CONSTANT TYPES *******************************/
var ACTION = require('../utils.js').ACTION;

/******************************* GLOBAL IMPORTS *******************************/
var PaymentController = require('../database/payments/PaymentController.js');
var HashGenerator = require('../database/payments/HashGenerator.js');

/******************************* PUBLIC METHODS *******************************/
/*
 * updatePayment
 * Processes and updates the payment according to the request sent.
 */
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
    else{ return null; }
  }

  function sendResponse(payment){
    if(!payment){ res.send('404'); }
    else{ res.send(payment); }
  }
};
