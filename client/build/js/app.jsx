//App.jsx should be our main mounting point for react router
//TODO: Add gulp min / uglify task to all react build code

Router = ReactRouter;

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Dispatcher = Flux.Dispatcher;
var AppDispatcher = new Dispatcher();

var App = React.createClass({
  render: function() {
    return (
      <RouteHandler />
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Signup} />
    <Route name="confirm" handler={Confirm} />
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler />, document.getElementById('app'));
});

