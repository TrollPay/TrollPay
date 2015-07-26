var Promise = require('bluebird');
var nodemailer = require('nodemailer');

var client = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD
  }
});

var from = 'noreply@trollpay.me';

module.exports.getTrollWelcomeEmail = function(troll){
  return {
    'from': from,
    'to': troll,
    'subject': 'Hello',
    'text': 'Hello world',
    'html': '<b>Hello world</b>'
  };
};

module.exports.getVictimWelcomeEmail = function(victim){
  return {
    'from': from,
    'to': victim,
    'subject': 'Hello',
    'text': 'Hello world',
    'html': '<b>Hello world</b>'
  };
};

module.exports.sendEmail = function(email){
  return new Promise(function(resolve, reject){
    client.sendMail(email, function(err, info) {
      if(err){ reject(err); }
      else{ resolve(info); }
    });
  });
};
