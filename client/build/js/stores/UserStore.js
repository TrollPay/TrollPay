// var UserStore = {
//   sender: {
//     access_token: null,
//     refresh_token: null,
//     first_name: null,
//     last_name: null,
//     display_name: null,
//     about: null,
//     email: null,
//     phone: null,
//     profile_picture_url: null,
//     ip_log: [null]
//   },
//   getUser: function(code) {
    
//     $.post('/venmo/fetchuser', {"code": code})
//       .done(function(data) {
//         console.log(data);
//       });
//   },
//   postData: function() {
//     $.post('/payment/create', data)
//       .done(function(data) {
//         alert('Completed data transmission' + data);
//       });
//   }
// };

// MicroEvent.mixin(UserStore);
