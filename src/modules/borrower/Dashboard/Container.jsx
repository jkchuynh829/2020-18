import React from "react";
import { connect } from "react-redux";

import { changeTopBarCopy } from "../../layout/actions";
import { getSavingsAccounts } from "../../saver/actions";
import { getLoans } from "../actions";
import { ContentHeader } from "../../../components/ContentHeader";
import { ProgressBar } from "../../../components/ProgressBar";
import { LoanDetails } from "../../../components/LoanDetails";
import { Button } from "../../../components/Button";

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
    const fundedLoans = loans.filter(
      loan => loanCurrents[loan.id] >= loan.amount
    );
    const activeCampaigns = loans.filter(
      loan => loanCurrents[loan.id] - 1 < loan.amount
    );

    return (
      <div className="borrower-dashboard-container">
        <ContentHeader title="Apply for a Loan" />
        {!loans.length && <p>Equalitee ensures a better chance for you to gain access to capital by allowing you to leverage the relationships you've cultivated within your own community. In addition to creative methods of assessing your capability, you gain access to investors around the globe who see potential of a community  supported entrepreneur.</p>}
        <div className="borrower-button-container">
          <Button
            text="Start an application"
            onClick={() => this.props.history.push("/user/borrower/apply")}
          />
        </div>
        {fundedLoans.length > 0 && <ContentHeader title="Funded Loans" />}
        {loans.map(loan => {
          const { purpose, amount, id } = loan;
          const completed = loanCurrents[id] || 0;
          const isLoanFunded = completed >= amount;

          if (!isLoanFunded) {
            return null;
          }

          return (
            <LoanDetails
              key={Math.random() * 100}
              title={purpose}
              total={amount}
              balance={amount - 100}
              amountDue="20"
              dueDate="11/1/2018"
            />
          );
        })}
        {activeCampaigns.length > 0 && (
          <ContentHeader title="My Loan Applications" />
        )}
        {loans.map(loan => {
          const { purpose, amount, id } = loan;
          const completed = loanCurrents[id] || 0;
          const isLoanFunded = completed - 1 < amount;

          if (isLoanFunded) {
            return null;
          }

          return (
            <ProgressBar
              key={Math.random() * 100}
              title={purpose.substr(0, 13)}
              completed={completed}
              total={amount}
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const loans = state.borrower.loans.filter(
    loan => String(loan.user_id) === String(state.auth.user.id)
  );

  return {
    loans,
    allSavingsAccounts: state.saver.allSavingsAccounts,
  };
};

export const BorrowerDashboardWrapped = connect(
  mapStateToProps,
  { changeTopBarCopy, getLoans, getSavingsAccounts }
)(BorrowerDashboard);
