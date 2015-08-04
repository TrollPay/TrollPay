var FeedPayment = React.createClass({
  render: function() {

    return (
    <div className="payment-wrapper">
      <li className="payment">
        <div className="payment-top">
          <img className="circular" src="./assets/profilepic.jpg" />
          <div className="payment-text">
            <p>
              <span className="names">{this.props.payer}</span> paid 
              <span className="names">{this.props.payee}</span>
              <span className="ago">{this.props.ago}</span>
            </p>
            <p>
              {this.props.message}
            </p>
            <p>
              <span className="like">Like</span>
              <span className="comment">Comment</span>
            </p>
          </div>
        </div>
      </li>
    </div>
    )
  }
})