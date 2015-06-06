//App.jsx should be our main mounting point for react router
//TODO: Add gulp min / uglify task to all react build code

var App = React.createClass({
  render: function() {
    return (
      <Signup />
    );
  }
});


React.render(
  <App />,
  document.getElementById('app')
);

