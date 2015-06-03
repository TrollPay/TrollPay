var App = React.createClass({
  handleSubmit: function(e) {
    console.log(e.target);
  },
  render: function() {
    return (
      <form onsubmit={this.handleSubmit}>
        <FormInput tag="recipient" placeholder="Recipient's email"/>
        <FormInput tag="note" placeholder="Optional note"/>
        <FormInput tag="total"placeholder="$Total Amount"/>
        <input type="submit" onsubmit={this.handleSubmit}/>
      </form>
    );
  }
});

React.render(
  <App />,
  document.getElementById('app')
);

