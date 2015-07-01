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
  getUser: function(code) {
    var url = 'https://api.venmo.com/v1/users/:user_id?access_token=' + code;
    // $.get(url, function(data) {
    //   console.log(data);
    // });
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      crossDomain: true,
      success: function(data) {
        console.log(data)
      },
      error: function() {
        console.log('error');
      },
      beforeSend: setHeader
    })
  },
  postData: function() {
    $.post('/payment/create', data)
      .done(function(data) {
        alert('Completed data transmission' + data);
      });
  }
};

MicroEvent.mixin(UserStore);
