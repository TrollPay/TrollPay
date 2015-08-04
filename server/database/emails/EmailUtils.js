/******************************** NPM MODULES *********************************/

var Promise = require('bluebird');
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');

/****************************** DEFAULT MODULES *******************************/

var path = require('path');
var fs = Promise.promisifyAll(require('fs'));

/****************************** GLOBAL IMPORTS ********************************/

var HashGenerator = require('../payments/HashGenerator.js');
var TROLLPAY = require('../../endpoints.js').TROLLPAY;

/*************************** CONFIGURE NODEMAILER *****************************/

var client = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD
  }
});

var from = 'noreply@trollpay.me';

/***************************** PUBLIC METHODS *********************************/

module.exports.getTrollEmail = function(sender, payment){

  return getHandlebarsFile('../../templates/troll.html')
  .then(makeTemplate)
  .then(fillTemplate)
  .then(getEmail);


  function fillTemplate(template){
    var html = template({
      'SENDER_NAME': sender.first_name + ' ' + sender.last_name,
      'TOTAL': payment.total,
      'BALANCE': payment.balance,
      'NOTE': payment.note,
      'CANCEL_LINK': getCancelLink(payment),
      'NUM_DAYS_LEFT': Math.floor(payment.balance),
      'NUM_DAYS_LEFT_DECREMENT': Math.floor(payment.balance) - 1
    });
    return html;
  }

  function getEmail(html){
    return {
      'from': from,
      'to': sender.email,
      'subject': 'Thank you for using Trollpay.me',
      'html': html
    };
  }
};

module.exports.getVictimEmail = function(sender, payment){

  return getHandlebarsFile('../../templates/victim.html')
  .then(makeTemplate)
  .then(fillTemplate)
  .then(getEmail);


  function fillTemplate(template){
    var html = template({
      'SENDER_NAME': sender.first_name + ' ' + sender.last_name,
      'TOTAL': payment.total,
      'BALANCE': payment.balance,
      'NOTE': payment.note,
      'CLAIM_LINK': getClaimLink(payment),
      'NUM_DAYS_LEFT': Math.floor(payment.balance),
      'NUM_DAYS_LEFT_DECREMENT': Math.floor(payment.balance) - 1
    });
    return html;
  }

  function getEmail(html){
    return {
      'from': from,
      'to': payment.recipient_email,
      'subject': 'You\'ve been troll paid.',
      'html': html
    };
  }
};

module.exports.sendEmail = function(email){
  console.log('email', email);
  return new Promise(function(resolve, reject){
    client.sendMail(email, function(err, info) {
      if(err){ reject(err); }
      else{ resolve(info); }
    });
  });
};

/**************************** PRIVATE METHODS *********************************/

var getHandlebarsFile = function(rel_path){
  return fs.readFileAsync(path.join(__dirname, rel_path), 'utf8');
};
var makeTemplate = function(html){
  return handlebars.compile(html);
};
var getClaimLink = function(payment){
  return TROLLPAY.CLAIM +
    HashGenerator.encodeBase64(payment._id, payment.claims[0]);
};
var getCancelLink = function(payment){
  return TROLLPAY.CANCEL +
    HashGenerator.encodeBase64(payment._id, payment.cancel);
};

