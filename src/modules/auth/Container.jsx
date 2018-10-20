import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { register } from "./actions";
import { LoginWrapped as Login } from "./components/Login";
import { RegisterWrapped as Register } from "./components/Register";

export class AuthContainer extends React.PureComponent {
  render() {
    const { isLoggedIn, register, userType } = this.props;
    const isSelectUserTypeVisible = isLoggedIn && userType === undefined;

    return (
      <div className="auth-container">
        {isSelectUserTypeVisible ? <Register register={register} /> : <Login />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userType: state.auth.userType,
});

export const AuthContainerWrapped = withRouter(
  connect(
    mapStateToProps,
    { register }
  )(AuthContainer)
);
