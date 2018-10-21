import React from "react";
import groupBy from "lodash/groupBy";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { changeTopBarCopy } from "../../layout/actions";
import {
  getLoans,
  getSavingsAccounts,
  getSavingsAccountsByUserId,
  createSavingsAccount,
} from "../actions";
import { ContentHeader, NewCertificateDetails } from "../../../components";

export class CertificatesContainer extends React.PureComponent {
  componentDidMount() {
    this.props.getLoans();
    this.props.getSavingsAccounts();
    this.props.changeTopBarCopy("Savings Certificates");
  }

  onClickNew = () => {
    this.props.history.push("/user/saver/certificates");
  };

  getLoanCurrents = () => {
    const { allSavingsAccounts } = this.props;

    return allSavingsAccounts.reduce((acc, savingsAccount) => {
      const current = acc[savingsAccount.loan_id]
        ? acc[savingsAccount.loan_id] + savingsAccount.amount
        : savingsAccount.amount;

      return { ...acc, [savingsAccount.loan_id]: current };
    }, {});
  };

  render() {
    const { loans, users, userId, createSavingsAccount } = this.props;
    const loanCurrents = this.getLoanCurrents();

    return (
      <div className="saver-certificates-container">
        <ContentHeader title="Open A New Account" />
        {loans.map(loan => {
          const { purpose, amount, term_length, id } = loan;
          const user = users.find(user => user.id === loan.user_id);
          const userFirstName = user && user.first_name;
          const completed = loanCurrents[id] || 0;

          if (completed >= amount) {
            return null;
          }

          return (
            <NewCertificateDetails
              title={purpose.substr(0, 13)}
              key={Math.random() * 100}
              id={id}
              userId={userId}
              postedBy={userFirstName}
              completed={completed}
              total={amount}
              interestRate="5"
              termLength={term_length}
              description={purpose}
              onCreate={createSavingsAccount}
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loans: state.saver.loans,
  allSavingsAccounts: state.saver.allSavingsAccounts,
  savingsAccounts: state.saver.savingsAccounts,
  userId: state.auth.user.id,
  users: state.auth.users,
});

export const CertificatesContainerWrapped = withRouter(
  connect(
    mapStateToProps,
    {
      changeTopBarCopy,
      getLoans,
      getSavingsAccounts,
      getSavingsAccountsByUserId,
      createSavingsAccount,
    }
  )(CertificatesContainer)
);
