import React from "react";
import { withRouter } from "react-router-dom";

export class BorrowerContainer extends React.PureComponent {
  render() {
    return <div className="borrower-container">Borrower</div>;
  }
}

export const BorrowerContainerWrapped = withRouter(BorrowerContainer);
