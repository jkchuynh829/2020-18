import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, withRouter } from "react-router-dom";
import { Graph } from "./Graph";

import { Container } from "./layout/Container";
import { AuthContainerWrapped as AuthContainer } from "./auth/Container";
// import { SaverContainerWrapped as SaverContainer } from "./saver/RouteContainer";

export class Root extends Component {
  render() {
    const { isLoggedIn, history, userType } = this.props;
    const isLoginOrRegisterVisible =
      (!userType || (!isLoggedIn && userType)) &&
      history.location.pathname !== "/";

    const isUserLoggedIn =
      isLoggedIn && userType && !history.location.pathname.includes("/user");

    if (isLoginOrRegisterVisible) {
      return <Redirect to="/" />;
    }

    if (isUserLoggedIn) {
      return <Redirect to={`/user/${userType}`} />;
    }

    return (
      <>
        <Route path="/" exact={true} component={AuthContainer} />
        <Route path="/user" component={Container} />
        <Graph/>
        {/* <Route path="/user/saver" exact={true} component={SaverContainer} /> */}
      </>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userType: state.auth.user.type,
});

export const RootWrapped = withRouter(
  connect(
    mapStateToProps,
    {}
  )(Root)
);
