import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, withRouter } from "react-router-dom";

import { Container } from "./layout/Container";
import { AuthContainerWrapped as AuthContainer } from "./auth/Container";
// import { SaverContainerWrapped as SaverContainer } from "./saver/RouteContainer";

export class Root extends Component {
  render() {
    const { isLoggedIn, history, userType } = this.props;
    console.log(userType);

    if (
      isLoggedIn &&
      userType &&
      !history.location.pathname.includes("/user")
    ) {
      return <Redirect to={`/user/${userType}`} />;
    }

    if (
      (!userType || (!isLoggedIn && userType)) &&
      history.location.pathname !== "/"
    ) {
      return <Redirect to="/" />;
    }

    return (
      <>
        <Route path="/" exact={true} component={AuthContainer} />
        <Route path="/user" component={Container} />
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
