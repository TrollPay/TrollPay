MicroEvent.mixin(PaymentStore);
MicroEvent.mixin(UserStore);

var PaymentStore = {
  payments: [],
  getAll: function() {
    return this.payments;
  }
}

var UserStore = {
  sender: {
    access_token: null,
    refresh_token: null,
    first_name: null,
    last_name: null,
    display_name: null,
    about: null,
    email: null,
    phone: null,
    profile_picture_url: null,
    ip_log: [null]
  },
  getUser: function() {
    //ping the venmo server with the code and then update the sender object
    //https://api.venmo.com/v1/users/:user_id?access_token=<access_token>
  }
}