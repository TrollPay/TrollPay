var Signup = React.createClass({
  invalidSubmit: function() {
    //TODO: notify user that form was improperly submitted and ask to try again
  },
  storeData: function() {
    //TODO: store the user's data in localStorage
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var inputs = Array.prototype.slice.call(e.target);
    inputs.forEach(function(input) {
      if (input.value) {
        console.log(input.attributes.placeholder);
        input.value = '';
      }
    });
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormInput tag="recipient" placeholder="Recipient's email"/>
        <FormInput tag="note" placeholder="Optional note"/>
        <FormInput tag="total" placeholder="$Total Amount"/>
        <input type="submit" onsubmit={this.handleSubmit}/>
      </form>
    );
  }
});

React.render(
  <Signup />,
  document.getElementById('app')
);

