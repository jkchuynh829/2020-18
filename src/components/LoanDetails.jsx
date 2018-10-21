import React from "react";
import { ButtonSmall } from "./";

export class LoanDetails extends React.PureComponent {
  render() {
    const { title, total, balance, amountDue, dueDate } = this.props;

    return (
      <div className="loan-details-container">
        <div className="loan-details-item">
          <div className="loan-details-title">{title} Loan</div>
          <div>${total}</div>
        </div>
        <div className="loan-details-item">
          <div className="loan-details-item-title">Balance</div>
          <div className="loan-details-item-info">${balance}</div>
        </div>
        <div className="loan-details-item">
          <div className="loan-details-item-title">Amount Due</div>
          <div className="loan-details-item-info">${amountDue}</div>
        </div>
        <div className="loan-details-item">
          <div className="loan-details-item-title">Due Date</div>
          <div className="loan-details-item-info">{dueDate}</div>
        </div>
        <div className="loan-make-payment">
          <ButtonSmall text="Make Payment" />
        </div>
      </div>
    );
  }
}
