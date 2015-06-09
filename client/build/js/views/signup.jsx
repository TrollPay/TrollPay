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

          {/* Recipient Input */}
          <div className="form-group">
            <label className="col-md-4 control-label" for="textinput">Recipient Email</label>
            <div className="col-md-5">
              <input id="textinput" name="recipient_email" type="text" placeholder="bob@example.com" className="form-control input-md"/>
            </div>
          </div>

          {/* Amount Input */} 
          <div className="form-group">
            <label className="col-md-4 control-label" for="prependedtext">Total Amount</label>
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-addon">$</span>
                <input title="recipient" id="prependedtext" name="total" className="form-control" placeholder="10.00" type="text"/>
              </div>
            </div>
          </div>

          {/* Custom Note */}  
          <div className="form-group">
            <label className="col-md-4 control-label" for="textarea">What's it for?</label>
            <div className="col-md-5">
              <textarea className="form-control" id="textarea" name="note"></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-group">
            <label className="col-md-4 control-label" for="singlebutton"></label>
            <div className="col-md-4">
              <button id="singlebutton" name="singlebutton" onClick={this.handleSubmit} className="btn btn-primary">Authorize with Venmo</button>
            </div>
          </div>

        </fieldset>
      </form>
    </div>
    );
  }
});