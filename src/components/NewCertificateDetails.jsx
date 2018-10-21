import React from "react";
import { withRouter } from "react-router-dom";
import { ContentHeader, ButtonSmall, ProgressBar } from "./";

export class NewCertificateDetails extends React.PureComponent {
  state = {
    isOpen: false,
  };

  onSelect = () => {
    this.props.history.push("/user/saver/certificates/1");
  };

  toggleDetails = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { isOpen } = this.state;
    const {
      completed,
      total,
      termLength,
      interestRate,
      title,
      description,
    } = this.props;

    return (
      <div
        className="new-certificate-details-container"
        onClick={this.toggleDetails}
      >
        {/* {isOpen && (
          <div className="new-certificate-details-card-header">
            <ContentHeader title={title} />
          </div>
        )} */}
        <div className="new-certificate-progress-bar">
          <ProgressBar title={title} completed={completed} total={total} />
        </div>
        {isOpen && (
          <>
            <div className="new-certificate-term-details">
              {termLength} months at {interestRate}%
            </div>
            <div className="new-certificate-term-description">
              {description}
            </div>
            <div className="new-certificate-details-button">
              <ButtonSmall text="Select" onClick={this.onSelect} />
            </div>
          </>
        )}
      </div>
    );
  }
}

export const NewCertificateDetailsWrapped = withRouter(NewCertificateDetails);
