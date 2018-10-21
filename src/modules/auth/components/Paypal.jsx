import React from "react";
import * as logo from "../../../logo.png";
import { connect } from "react-redux";
import { login } from "../actions";
import { Button } from "../../../components";

export class Paypal extends React.PureComponent {
  state = {
    paypalAuth: "",
  };

  componentDidMount() {
    const paypalAuth = window.location.pathname;
    this.setState({ paypalAuth });
  }
  render() {
    const { login } = this.state;
    const { paypalAuth } = this.props;
    console.log(paypalAuth);

    return (
      <div className="login-container">
        <div className="logo-container">Paypal: {paypalAuth}</div>
        {/* <div className="login-text">Log into your account</div> */}
        <div id="paypal-login-button" className="paypal-login-button">
          <Button text="Login with PayPal" onClick={login} />
        </div>
      </div>
    );
  }
}

export const PaypalWrapped = connect(
  () => ({}),
  { login }
)(Paypal);
