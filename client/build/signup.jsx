var Signup = React.createClass({
  getInitialState: function() {
    return {
      venmo: "https://api.venmo.com/v1/oauth/authorize?client_id=2638&scope=make_payments%20access_profile%20access_email%20access_phone%20access_balance&response_type=code"
    };
  },
  checkInputs: function() {
    //TODO: Check all of the user inputs and make sure that they are valid
  },
  storeData: function(key, data) {
    if (window.localStorage) {
      localStorage.setItem(key, data);
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    //TODO: Use checkInputs on all user inputs
    var inputs = Array.prototype.slice.call(e.target);
    //TODO: Refactor to not use placeholders as the key
    inputs.forEach(function(input) {
      if (input.value) {
        this.storeData(input.placeholder, input.value);
        input.value = '';
      }
    }.bind(this));
    window.location.replace(this.state.venmo);
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Input title="recipient" placeholder="Recipient's email"/>
        <Input title="note" placeholder="Optional note"/>
        <Input title="total" placeholder="$Total Amount"/>
        <input type="submit" onsubmit={this.handleSubmit} />
      </form>
    );
  }
});