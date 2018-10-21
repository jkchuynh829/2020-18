import React from "react";
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
    this.props.changeTopBarCopy("Why not add to the piggy bank?");
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
    const {
      loans,
      users,
      userId,
      createSavingsAccount,
      savingsAccounts,
    } = this.props;
    const loanCurrents = this.getLoanCurrents();

    return (
      <div className="saver-certificates-container">
        <ContentHeader title="Open A New Account" />
        {loans.map(loan => {
          const { purpose, title, amount, term_length, id } = loan;
          const user = users.find(user => user.id === loan.user_id);
          const userFirstName = user && user.first_name;
          const completed = loanCurrents[id] || 0;
          const didUserInvest = savingsAccounts.find(
            savingsAccount => String(savingsAccount.loan_id) === String(id)
          );

          if (completed >= amount || didUserInvest) {
            return null;
          }

          return (
            <NewCertificateDetails
              title={title}
              key={id}
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
