var FormStore = {
  inputs: {
    recipient: false,
    amount: false
  },
  setValidation: function(label, value) {
    if (label === 'Recipient Email') {
      this.inputs.recipient = value;
    } else if (label === 'Total Amount') {
      this.inputs.amount = value;
    }
  },

  isValid: function() {
    if (this.inputs.recipient && this.inputs.amount) {
      return true;
    } else {
      return false;
    }
  }
};

MicroEvent.mixin(FormStore);
