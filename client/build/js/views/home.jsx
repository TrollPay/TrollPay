var Home = React.createClass({
  getInitialState: function () {
    return {
      feedpayments: FeedStore.feedPayments
    };
  },
  componentDidMount: function() {
    setInterval(this.scrollFeed, 1000);
  },
  scrollFeed: function() {
    $('.payment-wrapper:first').slideUp('slow', 'linear', function() {
      $(this).parent().append(this);
      $(this).show();
    });
  },
  render: function() {
    var styles = {
      img: {
        width: '100%'
      }
    }
    return (
      <div className="row">
        <div className="col-lg-6">
          <div className="feed-container">
          <img id="iphone" src="./assets/iphonemock.png" alt="Iphone" />
            <div className="iphone-feed">
              <ul className="feed">

                <div className="feed-header">
                  <div className="toprow">
                    <img style={styles.img} id="iphone-header" 
                    src="./assets/iphone-action-bar.png" />
                  </div>
                </div>
                {this.state.feedpayments.map(function(payment) {
                  return (
                  <FeedPayment payer={payment.payer} payee={payment.payee} 
                  ago={payment.ago} message={payment.message} />
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <Signup />
          <div id="pitch" className="text-center">
            <h3>How TrollPay Works</h3>
            <ul id="pitch">
              <li>
                <p>
                  Owe a friend some money? Pay them 
                  back $1 at a time with TrollPay!
                </p>
              </li>
              <li>
                <p>
                  Create a payment in the form above and TrollPay will 
                  send your friend $1 every day via Venmo
                </p>
              </li>
              <li>
                <p>
                  Once you've created a payment just sit back, relax, 
                  and watch your Victim suffer!
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
})