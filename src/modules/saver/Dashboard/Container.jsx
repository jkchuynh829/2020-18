import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Graph } from "../../Graph";

import {
  getSavingsAccountsByUserId,
  getLoans,
  withDrawSavingsAccount,
} from "../actions";
import { changeTopBarCopy } from "../../layout/actions";
import {
  ContentHeader,
  SavingCertificateDetails,
  ButtonSmall,
  Button,
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

  format = data => {
    return data.reduce((acc, ele) => {
      acc.push({
        loanDuration: ele.term_length,
        principle: ele.amount,
        interestRate: ele.term_rate,
        startDate: ele.created_at,
      });
      return acc;
    }, []);
  };
  render() {
    const {
      savingsAccounts,
      loans,
      withDrawSavingsAccount,
      userEmail,
    } = this.props;

    return (
      <div className="saver-dashboard-container">
        <div className="saver-chart">
          {savingsAccounts.length ? (
            <Graph data={this.format(savingsAccounts)} />
          ) : (
            <div />
          )}
        </div>
        {savingsAccounts.length !== 0 && (
          <div className="saver-new-account">
            <ButtonSmall text="New Account" onClick={this.onClickNew} />
          </div>
        )}
        <ContentHeader title="My Open Accounts" />
        {savingsAccounts.length === 0 && (
          <div>
            <p>
              Our Zero-Risk Savings Certificate is one of the safest ways for
              you to put money away, earn a good return, and support your own
              community at the same time.
            </p>
            <p>
              Purchase one today to back a local entrepreneur. Once purchased,
              you'll start receiving monthly payments until the certificate's
              maturity date.{" "}
            </p>
            <p>
              You can also withdraw your savings (interest included) at any
              point.
            </p>
            <p style={{ paddingTop: "3rem" }} />
            <Button text="Open New Account" onClick={this.onClickNew} />
          </div>
        )}
        {savingsAccounts.map(savingsAccount => {
          const loan = loans.find(
            loan => String(loan.id) === String(savingsAccount.loan_id)
          );
          const title = (loan && loan.title) || "No Title";

          return (
            <SavingCertificateDetails
              title={title}
              key={savingsAccount.id}
              principle={savingsAccount.amount}
              interestRate="5"
              monthsLeft={savingsAccount.term_length}
              currentTotal={savingsAccount.amount}
              userEmail={userEmail}
              withDrawSavingsAccount={withDrawSavingsAccount}
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.auth.user.id,
  userEmail: state.auth.user.email,
  loans: state.saver.loans,
  savingsAccounts: state.saver.savingsAccounts,
});

export const DashboardContainerWrapped = withRouter(
  connect(
    mapStateToProps,
    {
      changeTopBarCopy,
      getLoans,
      getSavingsAccountsByUserId,
      withDrawSavingsAccount,
    }
  )(DashboardContainer)
);
