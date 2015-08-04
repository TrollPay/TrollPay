var Home = React.createClass({
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
                    <img style={styles.img} id="iphone-header" src="./assets/iphone-action-bar.png" />
                  </div>
                </div>

                <div className="payment-wrapper">
                  <li className="payment">
                    <div className="payment-top">
                      <img className="circular" src="./assets/profilepic.jpg" />
                      <div className="payment-text">
                        <p>
                          <span className="names">Kendall F</span> paid 
                          <span className="names">Mary Margaret H</span>
                          <span className="ago">1m</span>
                        </p>
                        <p>
                          Pony Farts
                        </p>
                        <p>
                          <span className="like">Like</span>
                          <span className="comment">Comment</span>
                        </p>
                      </div>
                    </div>
                  </li>
                </div>
                
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <Signup />
          <div id="pitch" className="text-center">
            <h3>How TrollPay Works</h3>
            <ul>
              <li>Asymmetrical tilde trust fund art party, DIY slow-carb Williamsburg stumptown.</li>
              <li>Cred freegan narwhal listicle, Wes Anderson yr pug semiotics single-origin</li>
              <li>Normcore wayfarers mumblecore sriracha.Salvia blog meditation, post-ironic vegan</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
})