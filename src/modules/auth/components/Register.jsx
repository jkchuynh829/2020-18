import React from "react";
import { connect } from "react-redux";
import { login } from "../actions";

export class Register extends React.PureComponent {
  selectSaver = () => {
    this.props.register("saver");
  };

  selectLoaner = () => {
    this.props.register("loaner");
  };

  selectBorrower = () => {
    this.props.register("borrower");
  };

  render() {
    const { login } = this.props;

    return (
      <div className="select-user-type-container">
        <div className="user-type-list" onClick={login}>
          <div className="user-type-list-item" onClick={this.selectSaver}>
            Saver
          </div>
          <div className="user-type-list-item" onClick={this.selectLoaner}>
            Loaner
          </div>
          <div className="user-type-list-item" onClick={this.selectBorrower}>
            Borrower
          </div>
        </div>
      </div>
    );
  }
}

export const RegisterWrapped = connect(
  () => ({}),
  { login }
)(Register);
