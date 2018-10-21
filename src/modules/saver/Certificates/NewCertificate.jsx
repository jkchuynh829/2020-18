import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import {
  createSavingsAccount,
  getSavingsAccounts,
  paySavingsAccount,
} from "../actions";
import { ContentHeader, Button } from "../../../components";
import Slider from "../../../components/Slider";

export class NewCertificate extends React.PureComponent {
  state = {
    amount: 10,
  };

  componentDidMount() {
    this.props.getSavingsAccounts();
  }

  onChange = value => {
    this.setState({ amount: value });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.redirectUrl !== this.props.redirectUrl) {
      window.location.href = this.props.redirectUrl;
    }
  }

  onCreate = () => {
    const {
      loan,
      interestRate = "5",
      createSavingsAccount,
      paySavingsAccount,
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

    paySavingsAccount({ amount, description: loan.title });
  };

  getLoanMax = () => {
    const { savingsAccounts, loan } = this.props;

    return savingsAccounts
      .filter(
        savingsAccount => String(savingsAccount.loan_id) === String(loan.id)
      )
      .reduce((acc, savingsAccount) => {
        return acc - savingsAccount.amount;
      }, loan.amount);
  };

  render() {
    const { loan, interestRate = "5" } = this.props;
    const { amount } = this.state;

    if (loan === undefined) {
      return null;
    }

    const loanMax = this.getLoanMax();

    return (
      <div className="new-certificate-container">
        <ContentHeader title={loan.title || "No title"} />
        <div className="new-certificate-item">
          <div className="new-certificate-item-value">
            Term: {loan.term_length} months at {interestRate}%
          </div>
        </div>
        <div className="new-certificate-slider">
          <Slider
            onChange={this.onChange}
            min={10}
            max={loanMax}
            type="amount"
          />
        </div>
        <div className="new-certificate-amount">{`$${amount}`}</div>
        <div className="new-certificate-button">
          <Button text="Deposit to Savings" onClick={this.onCreate} />
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
    redirectUrl: state.saver.redirectUrl,
    savingsAccounts: state.saver.allSavingsAccounts,
    userId: state.auth.user.id,
  };
};

export const NewCertificateWrapped = withRouter(
  connect(
    mapStateToProps,
    { createSavingsAccount, getSavingsAccounts, paySavingsAccount }
  )(NewCertificate)
);
