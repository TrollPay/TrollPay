AppDispatcher.register(function(payload) {
  switch (payload.eventName) {
    case 'new-payment':
      PaymentStore.payment = payload.newPayment;
      PaymentStore.sendData(function() { PaymentStore.trigger('confirmed-payment') })
      break;

    // case 'get-user-credentials':
    //   UserStore.getUser(payload.authData.code);
    //   UserStore.trigger('change');
    //   break;

    case 'store-form-in-localStorage':
      PaymentStore.putOne(payload.formData.inputs);
      PaymentStore.trigger('stored');
      break;

    case 'set-input-validation':
      FormStore.setValidation(payload.target.label, payload.target.value);
      FormStore.trigger('validationSet');
      break;

  }

  return true;

});
