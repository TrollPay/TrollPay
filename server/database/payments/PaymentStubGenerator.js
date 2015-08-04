var ACTION = require('../../utils.js').ACTION;

var _ = require('underscore');

var template = _.template(
  'TrollPay.me (<%= current %> of <%= total %>): <%= note %>'
);

module.exports.makeStub = function(user, payment, type) {
  var balance = payment.get('balance');
  return {
    'access_token': user.access_token,
    'email': payment.recipient_email,
    'note': makeNote(payment),
    'amount': getAmount(payment, type)
  };
};
var makeNote = function(payment) {
  var current = Math.floor(payment.total - payment.balance) + 1;
  var total = Math.floor(payment.total);
  return template({
    note: payment.note,
    current: current,
    total: total
  });
};

var getAmount = function(payment, type){
  var balance = payment.get('balance');
  if(type === ACTION.CLAIM){ return balance < 2 ? balance : 1; }
};

