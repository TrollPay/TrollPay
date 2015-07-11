var PaymentStore = {
  payment: null,
  //function to send data to server
  sendData: function() {
    $.post('/payment/create', this.payment, function(data) {
      console.log(data);
    });

  },
  getAll: function() {
    return this.payments;
  },
  putOne: function(inputs) {
    // TODO: validate inputs, then store in localStorage;
    var inputs = Array.prototype.slice.call(inputs);
    inputs.forEach(function(input) {
      if (input.value) {
        if (window.localStorage) {
          localStorage.setItem(input.name, input.value);
        }
        input.value = '';
      }
    }.bind(this));
  }
};

MicroEvent.mixin(PaymentStore);
