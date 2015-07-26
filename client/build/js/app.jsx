//App.jsx should be our main mounting point for react router
//TODO: Add gulp min / uglify task to all react build code

Router = ReactRouter;

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Dispatcher = Flux.Dispatcher;
var AppDispatcher = new Dispatcher();

var SetActiveStep = {
  componentWillMount: function() {
    console.log('1');
    if (localStorage) {
      switch (window.location.hash) {
        case '#/':
          localStorage.setItem('steps', 'create');
        case '#/confirm':
          localStorage.setItem('steps', 'all');
      }
    }
  },
  componentDidMount: function() {
    var active = localStorage.steps === 'all' ? 'confirm' : 'create';
    document.getElementById(active).setAttribute('class', 'active');
  }
};

var App = React.createClass({
  mixins: [SetActiveStep],
  render: function() {
    return (
      <div>
        <h1 className="text-center">Venmo your friends...</h1>
        <p className="lead text-center">$1 payments. One day at a time.</p>
        <div className="panel panel-default">
          <div className="panel-heading">
            <ul id="user-progress" className="nav nav-pills nav-justified" role="tablist">
              <li id="create" role="presentation">
                <a>Create Payment</a>
              </li>
              <li id="authorize" role="presentation">
                <a>Authorize with Venmo</a>
              </li>
              <li id="confirm" role="presentation">
                <a>Confirm Payment</a>
              </li>
            </ul>
          </div>
          <div className="panel-body">
            <RouteHandler />
          </div>
        </div>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Signup} />
    <Route name="confirm" handler={Confirm} />
    //Consider building the completed route as a nested route to Confirm
    <Route name="completed" handler={Completed} /> 
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler />, document.getElementById('app'));
});

