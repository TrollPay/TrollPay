var Input = React.createClass({
  getInitialState: function() {
    return ({
      type: null,
      label: null,
      input: null,
    });
  },

  validateInput: function(event){
      AppDispatcher.dispatch({
        eventName: 'set-input-validation',
        target: {
          label: this.state.label,
          value: this.state.validator.test(event.target.value) }
      });
  },

  makeTemplate: function(type) {
    switch (type) {
      case 'Recipient':
      this.state.input = <input id="textinput" name="recipient_email" type="text" placeholder="bob@example.com" className="form-control input-md" onChange={this.validateInput} />;
      this.state.type = 'textinput';
      this.state.label = 'Recipient Email';
      this.state.validator = new RegExp(/(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);
      break;

      case 'Amount':
      this.state.input = (<div className="input-group">
                <span className="input-group-addon">$</span>
                <input title="recipient" id="prependedtext" name="total" className="form-control" placeholder="10.00" type="text" onChange={this.validateInput}/>
              </div>);
      this.state.type = 'prependedtext';
      this.state.label = 'Total Amount';
      this.state.validator = new RegExp(/^[+-]?[0-9]{1,3}(?:[0-9]*(?:[.,][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{2})?)$/);
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
