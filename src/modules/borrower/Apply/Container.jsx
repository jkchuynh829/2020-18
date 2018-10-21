import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { changeTopBarCopy } from "../../layout/actions";
import { TextField } from "../../../components/TextField";
import { Button } from "../../../components/Button";

export class ApplyContainer extends React.PureComponent {
  state = {
    firstName: "Joe",
    lastName: "Smith",
    purpose: "",
    amount: "",
    term: "",
  };
  componentDidMount() {
    this.props.changeTopBarCopy("Apply for a loan");
  }

  onTextFieldChange = (field, value) => {
    this.setState({ [field]: value });
  };

  onSubmit = () => {
    this.props.history.push("/user/borrower/approved");
  };

  render() {
    const { firstName, lastName, purpose, amount, term } = this.state;
    const isButtonDisabled = purpose === "" || amount === "" || term === "";

    return (
      <div className="apply-container">
        <div className="apply-form">
          <TextField
            disabled={true}
            field="firstName"
            value={firstName}
            placeholder="First Name"
            onChange={this.onTextFieldChange}
          />
          <TextField
            disabled={true}
            field="lastName"
            value={lastName}
            placeholder="Last Name"
            onChange={this.onTextFieldChange}
          />
          <TextField
            field="purpose"
            value={purpose}
            placeholder="purpose"
            onChange={this.onTextFieldChange}
          />
          <TextField
            field="amount"
            value={amount}
            placeholder="amount"
            onChange={this.onTextFieldChange}
          />
          <TextField
            field="term"
            value={term}
            placeholder="term"
            onChange={this.onTextFieldChange}
          />
        </div>
        <div className="apply-button">
          <Button
            text="Submit"
            disabled={!isButtonDisabled}
            onClick={this.onSubmit}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export const ApplyContainerWrapped = withRouter(
  connect(
    mapStateToProps,
    { changeTopBarCopy }
  )(ApplyContainer)
);
