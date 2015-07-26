var Confirm = React.createClass({
  getInitialState: function() {
    return {
      // picture: UserStore.sender.profile_picture_url,
      total : localStorage["total"],
      note: localStorage["note"],
      recipient_email: localStorage["recipient_email"],
      code: localStorage["code"]
    }
  },
  componentDidMount: function() {
    if (url.code) {
      localStorage.setItem('code', url.code);
    }
    window.location.replace("/#/confirm");
  },
  toggleForm: function() {
    $('#progressBar').show();
    setInterval(function() {
      var progress = $('#progressBar > div').attr('aria-valuenow');
      var adjust = progress > 100 ? 100 : progress;
      $('#progressBar').attr('aria-valuenow', adjust);
    }, 100)
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.toggleForm();
    var data = {
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
        code: localStorage.code
      }
    });
    console.log(data);
  },
  render: function(){
    var style = {
      show: {
        display: 'none'
      },
      barWidth: {
        width: '45%'
      }
    }
    return (
      <div>
        <div id="progressBar" className="progress" style={style.show}>
          <div className="progress-bar progress-bar-striped active" 
          role="progressbar" aria-valuenow="45" aria-valuemin="0" 
          aria-valuemax="100" style={style.barWidth}>
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
