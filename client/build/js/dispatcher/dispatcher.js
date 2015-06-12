AppDispatcher.register(function(payload) {
  switch(payload.eventName) {
    case 'new-payment':
      PaymentStore.payments.push(payload.newPayment);
      break;
  }

  return true;

});