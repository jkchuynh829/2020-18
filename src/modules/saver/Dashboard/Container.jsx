import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { getSavingsAccountsByUserId, getLoans } from "../actions";
import { changeTopBarCopy } from "../../layout/actions";
import {
  ContentHeader,
  SavingCertificateDetails,
  ButtonSmall,
} from "../../../components";

export class DashboardContainer extends React.PureComponent {
  componentDidMount() {
    this.props.changeTopBarCopy("Keep Saving, You're Awesome!");
    this.props.getSavingsAccountsByUserId({ userId: this.props.userId });
    this.props.getLoans();
  }

  onClickNew = () => {
    this.props.history.push("/user/saver/certificates");
  };

  render() {
    const { savingsAccounts, loans } = this.props;

    return (
      <div className="saver-dashboard-container">
        <div className="saver-new-account">
          <ButtonSmall text="New Account" onClick={this.onClickNew} />
        </div>
        <ContentHeader title="My Open Accounts" />
        {savingsAccounts.map(savingsAccount => {
          const loan = loans.find(
            loan => String(loan.id) === String(savingsAccount.loan_id)
          );
          const title = (loan && loan.title) || "No Title";

          return (
            <SavingCertificateDetails
              title={title}
              key={Math.random() * 100}
              principle={savingsAccount.amount}
              interestRate="5"
              monthsLeft={savingsAccount.termLength}
              currentTotal={savingsAccount.amount * 1.05}
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.auth.user.id,
  loans: state.saver.loans,
  savingsAccounts: state.saver.savingsAccounts,
});

export const DashboardContainerWrapped = withRouter(
  connect(
    mapStateToProps,
    { changeTopBarCopy, getLoans, getSavingsAccountsByUserId }
  )(DashboardContainer)
);
