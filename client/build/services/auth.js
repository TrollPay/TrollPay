var Auth = function() {
};

Auth.prototype = {
  storeToken: function(token) {
    //Auth should have a method that can take the code returned and store the token
    localStorage.token = token;
  },
  checkCode: function() {
    //Check things against the sever
    var code = this.parseCode();
    return code;
  },
  parseCode: function() {
    var url = document.getElementsByTagName('a')[0];
    var code = url.search.split('=')[1];
    return code;
  }

}