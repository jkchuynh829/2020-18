import React from "react";
import { ContentHeader, Button } from "../../../components";

export class NewCertificate extends React.PureComponent {
  state = {
    amount: 0,
  };

  render() {
    const {
      maxAmount,
      interestRate = "5",
      termLength = "12",
      title = "Joe's Solar Panels",
    } = this.props;
    const { amount } = this.state;

    return (
      <div className="new-certificate-container">
        <ContentHeader title={title} />
        <div className="new-certificate-ite-m">
          <div className="new-certificate-item-title">Length</div>
          <div className="new-certificate-item-value">{termLength} months</div>
        </div>
        <div className="new-certificate-item">
          <div className="new-certificate-item-title">Interest Rate</div>
          <div className="new-certificate-item-value">{interestRate} %</div>
        </div>
        <div className="new-certificate-amount-slider">amount slider</div>
        <div className="new-certificate-amount">amount</div>
        <div className="new-certificate-button">
          <Button text="Create Account" />
        </div>
      </div>
    );
  }
}
