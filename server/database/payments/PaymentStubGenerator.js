var _ = require('underscore');

var template = _.template(
  'TrollPay.me (<%= current %> of <%= total %>): <%= note %>'
);

module.exports.makeStub = function(user, payment) {
  var balance = payment.get('balance');
  var amount = balance < 2 ? balance : 1;
  return {
    'access_token': user.access_token,
    'email': payment.recipient_email,
    'note': makeNote(payment) + '..cont',
    'amount': amount
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
