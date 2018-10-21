import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { createLoan } from "../actions";
import { changeTopBarCopy } from "../../layout/actions";
import { TextField } from "../../../components/TextField";
import { Button } from "../../../components/Button";
import Slider from "../../../components/Slider";

const SliderInput = ({ onChange, min, max, type, currentValue }) => (
  <div className="slider-container">
    <h2>Term: {`${currentValue} month${currentValue > 1 ? "s" : ""}`}</h2>
    <div className="slider-input">
      <Slider onChange={onChange} min={min} max={max} type={type} />
    </div>
  </div>
);

export class ApplyContainer extends React.PureComponent {
  state = {
    firstName: "Joe",
    lastName: "Smith",
    purpose: "",
    amount: "",
    term: 1,
  };

  componentDidMount() {
    this.props.changeTopBarCopy("Apply for a loan");
  }

  onTextFieldChange = (field, value) => {
    this.setState({ [field]: value });
  };

  onSliderChange = value => {
    this.setState({ term: value });
  };

  onSubmit = () => {
    const { purpose, amount, term } = this.state;
    this.props.createLoan({
      userId: "5",
      purpose,
      amount,
      termLength: term,
      termRate: "20",
    });
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
          <SliderInput
            onChange={this.onSliderChange}
            min={1}
            max={12}
            currentValue={this.state.term}
            type="term"
          />
        </div>
        <div className="apply-button">
          <Button
            text="Submit"
            disabled={isButtonDisabled}
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
    { changeTopBarCopy, createLoan }
  )(ApplyContainer)
);
