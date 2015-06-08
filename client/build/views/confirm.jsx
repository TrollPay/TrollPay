var Confirm = React.createClass({
  getInitialState: function() {
    return {
      picture: null,
      total : null || localStorage["$Total Amount"],
      note: null || localStorage["Optional note"], 
      email: null || localStorage["Recipient's email"]
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    //need to use payment controller's addNewPayment method to add this information into our system
    var data = {
      sender: {
        access_token: null,
        refresh_token: null,
        first_name: null,
        last_name: null,
        display_name: null,
        about: null,
        email: null,
        phone: null,
        profile_picture_url: null,
        ip_log: [null]
      },
      payment: {
        recipient_email: this.state.email,
        total: this.state.total,
        note: this.state.note,
        isCancelled: false,
        created_at: new Date().toISOString(),
        balance: this.state.total,
        installments: []
      }
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
          <p>{this.state.email}</p>
        </div> 
        <form onSubmit={this.handleSubmit}>
          <input type="submit" />
        </form>
      </div>
    );
  }
});