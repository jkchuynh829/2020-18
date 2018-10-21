import React from "react";
import { connect } from "react-redux";

import { changeTopBarCopy } from "../../layout/actions";
import { getSavingsAccounts } from "../../saver/actions";
import { getLoans } from "../actions";
import { ContentHeader } from "../../../components/ContentHeader";
import { ProgressBar } from "../../../components/ProgressBar";
import { LoanDetails } from "../../../components/LoanDetails";

export class BorrowerDashboard extends React.PureComponent {
  componentDidMount() {
    this.props.changeTopBarCopy("Manage Applications");
    this.props.getLoans({ userId: "5" });
    this.props.getSavingsAccounts();
  }

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
    const { loans } = this.props;
    const loanCurrents = this.getLoanCurrents();

    return (
      <div className="borrower-dashboard-container">
        <ContentHeader title="My Loan Applications" />
        {loans.map(loan => {
          const { purpose, amount, id } = loan;
          const completed = loanCurrents[id] || 0;

          return (
            <ProgressBar
              title={purpose.substr(0, 13)}
              completed={completed}
              total={amount}
            />
          );
        })}
        <ContentHeader title="Funded Loans" />
        <LoanDetails
          title="Fertilizer"
          total="500"
          balance="300"
          amountDue="20"
          dueDate="11/1/2018"
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loans: state.borrower.loans,
  allSavingsAccounts: state.saver.allSavingsAccounts,
});

export const BorrowerDashboardWrapped = connect(
  mapStateToProps,
  { changeTopBarCopy, getLoans, getSavingsAccounts }
)(BorrowerDashboard);
