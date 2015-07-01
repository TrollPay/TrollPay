AppDispatcher.register(function(payload) {
  switch (payload.eventName) {
    case 'new-payment':
      PaymentStore.payment = payload.newPayment;
      PaymentStore.sendData();
      break;

    case 'get-user-credentials':
      console.log('in the dispatcher getting creds')
      UserStore.getUser(payload.authData.code);
      UserStore.trigger('change');
      break;

    case 'store-form-in-localStorage':
      PaymentStore.putOne(payload.formData.inputs);
      PaymentStore.trigger('stored');
      break;

    case 'set-input-validation':
      console.log('asdf');
      FormStore.setValidation(payload.target.label, payload.target.value);
      FormStore.trigger('validationSet');
      break;

  }

  return true;

});
