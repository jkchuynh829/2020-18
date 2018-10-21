import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "../../../components/Button";

export class ApprovedContainer extends React.PureComponent {
  onView = () => {
    this.props.history.push("/user/borrower/dashboard");
  };

  render() {
    return (
      <div className="approved-container">
        <div className="approved-content">
          <div className="approved-icon">
            <i className="fas fa-check-circle" />
          </div>
          <div className="approved-title">Congratulations</div>
          <div className="approved-text">
            Your loan application has been approved and your funding campaign is
            now live!
          </div>
        </div>
        <div className="approved-button">
          <Button text="View" onClick={this.onView} />
        </div>
      </div>
    );
  }
}

export const ApprovedContainerWrapped = withRouter(ApprovedContainer);
