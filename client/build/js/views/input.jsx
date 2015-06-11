var Input = React.createClass({
  getInitialState: function() {
    return ({
      type: null,
      label: null,
      input: null
    });
  },
  makeTemplate: function(type) {
    switch (type) {
      case 'Recipient': 
      this.state.input = <input id="textinput" name="recipient_email" type="text" placeholder="bob@example.com" className="form-control input-md"/>;
      this.state.type = 'textinput';
      this.state.label = 'Recipient Email';
      break;

      case 'Amount': 
      this.state.input = (<div className="input-group">
                <span className="input-group-addon">$</span>
                <input title="recipient" id="prependedtext" name="total" className="form-control" placeholder="10.00" type="text"/>
              </div>);
      this.state.type = 'prependedtext';
      this.state.label = 'Total Amount';
      break;

      case 'Note':
      this.state.input = <textarea className="form-control" id="textarea" name="note"></textarea>;
      this.state.type = 'textarea';
      this.state.label = "What's it for?";
      break;

      case 'Submit':
      this.state.input = <button id="singlebutton" name="singlebutton" onClick={this.handleSubmit} className="btn btn-primary">Authorize with Venmo</button>;
      this.state.type = 'singlebutton';
      this.state.label = '';
      break;
    }
  },
  render: function() {
    this.makeTemplate(this.props.type);
    return (
    <div className="form-group">
        <label className="col-md-4 control-label">{this.state.label}</label>
        <div className="col-md-5">
          {this.state.input}
        </div>
      </div>
    )
  }
});