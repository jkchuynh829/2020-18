import React from "react";
import { withRouter } from "react-router-dom";

export class LoanerContainer extends React.PureComponent {
  render() {
    return <div className="loaner-container">Loaner</div>;
  }
}

export const LoanerContainerWrapped = withRouter(LoanerContainer);
