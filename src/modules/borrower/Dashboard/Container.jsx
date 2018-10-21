import React from "react";
import { connect } from "react-redux";

import { changeTopBarCopy } from "../../layout/actions";
import { getLoans } from "../actions";
import { ContentHeader } from "../../../components/ContentHeader";
import { ProgressBar } from "../../../components/ProgressBar";
import { LoanDetails } from "../../../components/LoanDetails";

export class BorrowerDashboard extends React.PureComponent {
  componentDidMount() {
    this.props.changeTopBarCopy("Manage Applications");
    this.props.getLoans({ userId: "5" });
  }

  render() {
    const { loans } = this.props;

    return (
      <div className="borrower-dashboard-container">
        <ContentHeader title="My Loan Applications" />
        {loans.map(loan => {
          const { purpose, amount } = loan;

          return (
            <ProgressBar
              title={purpose.substr(0, 13)}
              completed="150"
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
});

export const BorrowerDashboardWrapped = connect(
  mapStateToProps,
  { changeTopBarCopy, getLoans }
)(BorrowerDashboard);
