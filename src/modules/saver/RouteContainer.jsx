import React from "react";
import { Route, withRouter } from "react-router-dom";
import { DashboardContainerWrapped as Dashboard } from "./Dashboard/Container";

export class SaverContainer extends React.PureComponent {
  render() {
    return (
      <div className="saver-container">
        <Route path="/user/saver" exact={true} component={Dashboard} />
      </div>
    );
  }
}

export const SaverContainerWrapped = withRouter(SaverContainer);
