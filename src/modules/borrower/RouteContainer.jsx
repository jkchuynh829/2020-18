import React from "react";
import { Route, withRouter } from "react-router-dom";
import { ApplyContainerWrapped as Apply } from "./Apply/Container";
import { ApprovedContainerWrapped as Approved } from "./Approved/Container";
import { BorrowerDashboardWrapped as Dashboard } from "./Dashboard/Container";

export class BorrowerContainer extends React.PureComponent {
  render() {
    return (
      <div className="borrower-container">
        <Route path="/user/borrower" exact={true} component={Dashboard} />
        <Route path="/user/borrower/apply" component={Apply} />
        <Route path="/user/borrower/approved" component={Approved} />
        <Route path="/user/borrower/dashboard" component={Dashboard} />
      </div>
    );
  }
}

export const BorrowerContainerWrapped = withRouter(BorrowerContainer);
