import React from "react";
import { Route, withRouter } from "react-router-dom";
import { SaverContainerWrapped as SaverContainer } from "../saver/RouteContainer";
import { BorrowerContainerWrapped as BorrowerContainer } from "../borrower/RouteContainer";
import { LoanerContainerWrapped as LoanerContainer } from "../loaner/RouteContainer";

export class RouteContainer extends React.PureComponent {
  render() {
    return (
      <div className="content-container">
        <Route path="/user/saver" component={SaverContainer} />
        <Route path="/user/borrower" component={BorrowerContainer} />
        <Route path="/user/loaner" component={LoanerContainer} />
      </div>
    );
  }
}

export const RouteContainerWrapped = withRouter(RouteContainer);
