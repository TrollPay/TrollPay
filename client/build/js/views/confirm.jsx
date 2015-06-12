var Confirm = React.createClass({
  getInitialState: function() {
    return {
      picture: null,
      total : localStorage["total"],
      note: localStorage["note"], 
      recipient_email: localStorage["recipient_email"]
    }
  },
  componentDidMount: function() {
    UserStore.bind('change', this.credentialsRecieved);
    AppDispatcher.dispatch({
      eventName: 'get-user-credentials',
    });
  },
  credentialsRecieved: function() {
    this.forceUpdate();
  },
  handleSubmit: function(e) {
    e.preventDefault();
    AppDispatcher.dispatch({
      eventName: 'new-payment',
      newPayment: {payment: data.payment}
    });
    var data = {
      recipient_email: this.state.recipient_email,
      total: this.state.total,
      note: this.state.note,
      isCancelled: false,
      created_at: new Date().toISOString(),
      balance: this.state.total,
      installments: []
    }
    //send over the data that you have to our server and wait for it at a certain route that you have planned.
    $.post('/payment/create', data)
      .done(function(data) {
        alert('Completed data transmission' + data);
      });
    //after submission, change the route to the dashboard page with a sucess message    
  },
  render: function(){
    return (
      <div>
        <div>
          <h4>Total Amount</h4>
          <p>{this.state.total}</p>
        </div>
        <div>
          <h4>Custom Note</h4>
          <p>{this.state.note}</p>
        </div>
        <div>
          <h4>Recipient email</h4>
          <p>{this.state.recipient_email}</p>
        </div> 
        <form onSubmit={this.handleSubmit}>
          <input type="submit" />
        </form>
      </div>
    );
  }
});