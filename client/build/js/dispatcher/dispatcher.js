AppDispatcher.register(function(payload) {
  switch(payload.eventName) {
    case 'new-payment':
      PaymentStore.payments.push(payload.newPayment);
      break;

    case 'get-user-credentials':
      UserStore.getUser();
      UserStore.trigger('change');
      break;
  }

  return true;

});