var PaymentStore = {
  payments: [],
  getAll: function() {
    return this.payments;
  },
  putOne: function(inputs) {
    // TODO: validate inputs, then store in localStorage;
    // FIX: storeData is not defined. 
    inputs.forEach(function(input) {
      if (input.value) {
        this.storeData(input.name, input.value);
        input.value = '';
      }
    }.bind(this));
  }
};

MicroEvent.mixin(PaymentStore);
