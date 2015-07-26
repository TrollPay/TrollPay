var Confirm = React.createClass({
  getInitialState: function() {
    return {
      // picture: UserStore.sender.profile_picture_url,
      total : localStorage["total"],
      note: localStorage["note"],
      recipient_email: localStorage["recipient_email"],
      submitted: 'none',
      code: localStorage["code"]
    }
  },
  componentDidMount: function() {
    if (url.code) {
      localStorage.setItem('code', url.code);
    }
    window.location.replace("/#/confirm");
  },
  credentialsRecieved: function() {
    this.forceUpdate();
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.setState({submitted: 'show'});
    var data = {
      access_token: url.code,
      recipient_email: this.state.recipient_email,
      total: this.state.total,
      note: this.state.note,
      isCancelled: false,
      created_at: new Date().toISOString(),
      balance: this.state.total,
      installments: []
    };

    AppDispatcher.dispatch({
      eventName: 'new-payment',
      newPayment: {
        payment: data,
        code: url.code
      }
    });
  },
  render: function(){
    var styles = {
      barWidth: {
        width: '45%'
      },
      show: {
        display: this.state.submitted
      }
    }
    return (
      <div>
        <div className="progress" style={styles.show}>
          <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style={styles.barWidth}>
            <span className="sr-only">45% Complete</span>
          </div>
        </div>
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
          <input type="submit"> 
            <Link to="completed" />
          </input>
        </form>
      </div>
    );
  }
});
