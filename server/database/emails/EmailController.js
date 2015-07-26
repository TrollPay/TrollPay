var Promise = require('bluebird');

var Utils = require('./EmailUtils.js');

module.exports.sendWelcomeEmails = function(sender, recipient){
  var emails = [
    Utils.getTrollWelcomeEmail(sender),
    Utils.getVictimWelcomeEmail(recipient)
  ];
  return Promise.all(emails.map(Utils.sendEmail));
};
