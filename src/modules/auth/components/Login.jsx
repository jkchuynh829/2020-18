import React from "react";
import { connect } from "react-redux";
import { login } from "../actions";

export class Login extends React.PureComponent {
  render() {
    const { login } = this.props;

    return (
      <div className="login-container">
        <div className="paypal-login-button" onClick={login}>
          Login With Paypal
        </div>
      </div>
    );
  }
}

export const LoginWrapped = connect(
  () => ({}),
  { login }
)(Login);
