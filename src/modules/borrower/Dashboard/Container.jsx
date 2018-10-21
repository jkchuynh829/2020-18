import React from "react";
import { connect } from "react-redux";

import { changeTopBarCopy } from "../../layout/actions";
import { ContentHeader } from "../../../components/ContentHeader";
import { ProgressBar } from "../../../components/ProgressBar";
import { LoanDetails } from "../../../components/LoanDetails";

export class BorrowerDashboard extends React.PureComponent {
  componentDidMount() {
    this.props.changeTopBarCopy("Manage Applications");
  }

  render() {
    return (
      <div className="borrower-dashboard-container">
        <ContentHeader title="My Loan Applications" />
        <ProgressBar title="Goat Feed" completed="150" total="200" />
        <ProgressBar title="Solar Panel" completed="1000" total="3000" />
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

const mapStateToProps = state => ({});

export const BorrowerDashboardWrapped = connect(
  mapStateToProps,
  { changeTopBarCopy }
)(BorrowerDashboard);
