import React from "react";
import { connect } from "react-redux";
import { login } from "../actions";
import { Button } from "../../../components";

export class Login extends React.PureComponent {
  render() {
    const { login } = this.props;

    return (
      <div className="login-container">
        <div className="login-text">
          Log into
          <br /> your account
        </div>
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
