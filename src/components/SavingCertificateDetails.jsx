import React from "react";
import { ButtonSmall } from "./";

export class SavingCertificateDetails extends React.PureComponent {
  withDraw = () => {
    const { withDrawSavingsAccount, userEmail, currentTotal } = this.props;
    withDrawSavingsAccount({ email: userEmail, amount: currentTotal });
  };

  render() {
    const {
      title,
      interestRate,
      principle,
      monthsLeft,
      currentTotal,
    } = this.props;

    return (
      <div className="loan-details-container">
        <div className="loan-details-item">
          <div className="loan-details-title">{title}</div>
        </div>
        <div className="loan-details-item">
          <div className="loan-details-item-title">Principle</div>
          <div className="loan-details-item-info">${principle}</div>
        </div>
        <div className="loan-details-item">
          <div className="loan-details-item-title">Months Left</div>
          <div className="loan-details-item-info">{monthsLeft} months</div>
        </div>
        <div className="loan-details-item">
          <div className="loan-details-item-title">Interest Rate</div>
          <div className="loan-details-item-info">{interestRate}%</div>
        </div>
        <div className="loan-details-item">
          <div className="loan-details-item-title">Current Total</div>
          <div className="loan-details-item-info">${currentTotal}</div>
        </div>
        <div className="loan-make-payment">
          <ButtonSmall text="Withdraw" />
        </div>
      </div>
    );
  }
}
