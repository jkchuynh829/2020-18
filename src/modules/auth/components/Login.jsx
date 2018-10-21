import React from "react";
import * as logo from "../../../logo.png";
import { connect } from "react-redux";
import { login } from "../actions";
import { Button } from "../../../components";

export class Login extends React.PureComponent {
  render() {
    const { login } = this.props;

    return (
      <div className="login-container">
        <div className="logo-container">
          <img alt="Equalitee" src={logo} className="logo" />
        </div>
        {/* <div className="login-text">Log into your account</div> */}
        <div className="paypal-login-button">
          <Button text="Login with PayPal" onClick={login} />
        </div>
      </div>
    );
  }
}

export const LoginWrapped = connect(
  () => ({}),
  { login }
)(Login);
