import React from "react";
import { connect } from "react-redux";

import { changeTopBarCopy } from "../../layout/actions";
import { ContentHeader } from "../../../components";

export class DashboardContainer extends React.PureComponent {
  componentDidMount() {
    this.props.changeTopBarCopy("Savings Certificates");
  }

  render() {
    return (
      <div className="saver-dashboard-container">
        <ContentHeader title="My Open Accounts" />
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export const DashboardContainerWrapped = connect(
  mapStateToProps,
  { changeTopBarCopy }
)(DashboardContainer);
