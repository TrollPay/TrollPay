var Signup = React.createClass({

  getInitialState: function() {
    return {
      venmo: "https://api.venmo.com/v1/oauth/authorize?client_id=2638&scope=make_payments%20access_profile%20access_email%20access_phone%20access_balance&response_type=code",
      canSubmit: false
    };
  },

  componentDidMount: function() {
    PaymentStore.bind('stored', this.submitHandled);
    FormStore.bind('validationSet', this.setCanSubmit);
    localStorage.clear();

  },

  setCanSubmit: function(){
    this.setState({ canSubmit: FormStore.isValid() });
    this.forceUpdate();
  },

  storeData: function(key, data) {
    if (window.localStorage) {
      localStorage.setItem(key, data);
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var inputs = document.querySelectorAll('input, textarea');
    if(this.state.canSubmit){
      AppDispatcher.dispatch({
        eventName: 'store-form-in-localStorage',
        formData: {'inputs': inputs}
      });
    } else{
      console.log('dat shit aint valid');
    }
  },

  submitHandled: function(){
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
