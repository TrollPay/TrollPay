var Signup = React.createClass({
  getInitialState: function() {
    return {
      venmo: "https://api.venmo.com/v1/oauth/authorize?client_id=2638&scope=make_payments%20access_profile%20access_email%20access_phone%20access_balance&response_type=code"
    };
  },
  componentDidMount: function() {
    localStorage.clear();
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
    var inputs = Array.prototype.slice.call(document.querySelectorAll('input, textarea'));
    //TODO: Refactor to not use placeholders as the key
    //TODO: Move this logic to our PaymentStore
    //TODO: Bind this to listen to a change on out PaymentStore and rerender itself
    inputs.forEach(function(input) {
      if (input.value) {
        this.storeData(input.name, input.value);
        input.value = '';
      }
    }.bind(this));
    window.location.replace(this.state.venmo);
  },
  render: function() {
    return (
      <div>
      <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <fieldset>
          <Input type='Recipient' />
          <Input type='Amount' />
          <Input type='Note' />
          <Input type='Submit' />
        </fieldset>
      </form>
    </div>
    );
  }
});