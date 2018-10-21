import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, withRouter } from "react-router-dom";
import { Graph } from "./Graph";

import { Container } from "./layout/Container";
import { getUsers } from "./auth/actions";
import { AuthContainerWrapped as AuthContainer } from "./auth/Container";
import { RegisterWrapped as Register } from "./auth/components/Register";
import { LogoutWrapped as Logout } from "./auth/components/Logout";
// import { SaverContainerWrapped as SaverContainer } from "./saver/RouteContainer";

export class Root extends Component {
  componentDidMount() {
    this.props.getUsers();
  }

  render() {
    const { isLoggedIn, history, userType } = this.props;
    const isLoginOrRegisterVisible =
      !userType &&
      history.location.pathname !== "/" &&
      history.location.pathname !== "/logout";

    const isUserLoggedIn =
      userType && !history.location.pathname.includes("/user");

    if (isLoginOrRegisterVisible) {
      return <Redirect to="/" />;
    }

    if (isUserLoggedIn) {
      return <Redirect to={`/user/${userType}`} />;
    }

    return (
      <>
        <Route path="/" exact={true} component={AuthContainer} />
        <Route path="/logout" exact={true} component={Logout} />
        <Route path="/register" exact={true} component={Register} />
        <Route path="/user" component={Container} />
        <Graph/>
        {/* <Route path="/user/saver" exact={true} component={SaverContainer} /> */}
      </>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userType: state.auth.user.user_type,
});

export const RootWrapped = withRouter(
  connect(
    mapStateToProps,
    { getUsers }
  )(Root)
);
