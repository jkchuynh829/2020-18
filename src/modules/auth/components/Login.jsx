import React from "react";
import * as logo from "../../../logo.png";
import { connect } from "react-redux";
import { login } from "../actions";
import { Button, ButtonSmall, TextField } from "../../../components";

export class Login extends React.PureComponent {
  state = {
    username: "",
    password: "",
  };

  onChange = (field, value) => {
    this.setState({ [field]: value });
  };

  onLogin = () => {
    this.props.login(this.state.username);
  };

  render() {
    const { username, password } = this.state;

    return (
      <div className="login-container">
        <div className="login-inner-container">
          <div className="logo-container">
            <img alt="Equalitee" src={logo} className="logo" />
          </div>
          {/* <div className="login-text">Log into your account</div> */}
          <div className="login-form">
            <TextField
              field="username"
              placeholder="email address"
              value={username}
              onChange={this.onChange}
            />
            <TextField
              field="password"
              placeholder="password"
              value={password}
              onChange={this.onChange}
              type="password"
            />
            <div className="login-button">
              <Button text="Login" onClick={this.onLogin} />
            </div>
          </div>
        </div>
        <div className="register-button">
          <ButtonSmall text="Register" onClick={this.onRegister} />
        </div>
      </div>
    );
  }
}

export const LoginWrapped = connect(
  () => ({}),
  { login }
)(Login);
