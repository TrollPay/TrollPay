var Confirm = React.createClass({
  getInitialState: function() {
    return {
      picture: null,
      total : null || localStorage["$Total Amount"],
      note: null || localStorage["Optional note"], 
      email: null || localStorage["Recipient's email"]
    }
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
      </div>
    );
  }
});