import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { changeTopBarCopy } from "../../layout/actions";
import {
  ContentHeader,
  SavingCertificateDetails,
  ButtonSmall,
} from "../../../components";

export class DashboardContainer extends React.PureComponent {
  componentDidMount() {
    this.props.changeTopBarCopy("Savings Certificates");
  }

  onClickNew = () => {
    this.props.history.push("/user/saver/certificates");
  };

  render() {
    return (
      <div className="saver-dashboard-container">
        <div className="saver-new-account">
          <ButtonSmall text="New Account" onClick={this.onClickNew} />
        </div>
        <ContentHeader title="My Open Accounts" />
        <SavingCertificateDetails
          title="Joe's Solar Panels"
          principle="100"
          interestRate="5"
          monthsLeft="7"
          currentTotal="104"
        />
        <SavingCertificateDetails
          title="Tom's Sewing Machine"
          principle="50"
          interestRate="7"
          monthsLeft="2"
          currentTotal="55"
        />
        <SavingCertificateDetails
          title="Sandy's Oven"
          principle="300"
          interestRate="5"
          monthsLeft="15"
          currentTotal="307.50"
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export const DashboardContainerWrapped = withRouter(
  connect(
    mapStateToProps,
    { changeTopBarCopy }
  )(DashboardContainer)
);
