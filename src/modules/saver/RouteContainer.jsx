import React from "react";
import { withRouter } from "react-router-dom";

export class SaverContainer extends React.PureComponent {
  render() {
    return <div className="saver-container">Saver</div>;
  }
}

export const SaverContainerWrapped = withRouter(SaverContainer);
