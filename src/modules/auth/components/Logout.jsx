import React from "react";
import { connect } from "react-redux";
import { logout } from "../actions";

export class Logout extends React.PureComponent {
  componentDidMount() {
    this.props.logout();
  }

  render() {
    return null;
  }
}

export const LogoutWrapped = connect(
  () => ({}),
  { logout }
)(Logout);
