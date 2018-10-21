import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { createSavingsAccount } from "../actions";
import { ContentHeader, Button } from "../../../components";
import Slider from "../../../components/Slider";

export class NewCertificate extends React.PureComponent {
  state = {
    amount: 25,
  };

  onChange = value => {
    this.setState({ amount: value });
  };

  onCreate = () => {
    const {
      loan,
      interestRate = "5",
      createSavingsAccount,
      userId,
    } = this.props;
    const { amount } = this.state;

    createSavingsAccount({
      userId,
      amount,
      loanId: loan.id,
      termLength: loan.term_length,
      termRate: interestRate,
    });
  };

  render() {
    const { loan, interestRate = "5" } = this.props;
    const { amount } = this.state;

    console.log("loan", loan);

    return (
      <div className="new-certificate-container">
        <ContentHeader title={loan.title || "No title"} />
        <div className="new-certificate-item">
          <div className="new-certificate-item-title">Length</div>
          <div className="new-certificate-item-value">
            {loan.term_length} months
          </div>
        </div>
        <div className="new-certificate-item">
          <div className="new-certificate-item-title">Interest Rate</div>
          <div className="new-certificate-item-value">{interestRate}%</div>
        </div>
        <Slider
          onChange={this.onChange}
          min={25}
          max={loan.amount}
          type="amount"
        />
        <div className="new-certificate-amount">{`$${amount}`}</div>
        <div className="new-certificate-button">
          <Button text="Create Account" onClick={this.onCreate} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const loanId = ownProps.match.params.id;
  const loan = state.saver.loans.find(
    loan => String(loan.id) === String(loanId)
  );

  return {
    loan,
    userId: state.auth.user.id,
  };
};

export const NewCertificateWrapped = withRouter(
  connect(
    mapStateToProps,
    { createSavingsAccount }
  )(NewCertificate)
);
