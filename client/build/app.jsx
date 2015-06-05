var Signup = React.createClass({
  invalidSubmit: function() {
    //TODO: notify user that form was improperly submitted and ask to try again
  },
  storeData: function(key, data) {
    if (window.localStorage) {
      //localStorage.setItem('key', 'value')
      window.localStorage[key] = data;
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var inputs = Array.prototype.slice.call(e.target);
    //TODO: Refactor to not use placeholders as the key
    inputs.forEach(function(input) {
      if (input.value) {
        console.dir(input)
        this.storeData(input.placeholder, input.value)
        input.value = '';
      }
    }.bind(this));
    window.location.replace("https://api.venmo.com/v1/oauth/authorize?client_id=2638&scope=make_payments%20access_profile%20access_email%20access_phone%20access_balance&response_type=code")
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormInput title="recipient" placeholder="Recipient's email"/>
        <FormInput title="note" placeholder="Optional note"/>
        <FormInput title="total" placeholder="$Total Amount"/>
        <input type="submit" onsubmit={this.handleSubmit} />
      </form>
    );
  }
});

React.render(
  <Signup />,
  document.getElementById('app')
);

