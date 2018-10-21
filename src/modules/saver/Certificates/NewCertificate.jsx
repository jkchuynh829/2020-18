import React from "react";
import { ContentHeader, Button } from "../../../components";
import Slider from '../../../components/Slider';

export class NewCertificate extends React.PureComponent {
  state = {
    amount: 25,
  };

  onChange = (value) => {
    this.setState({ amount: value });
  }

  render() {
    const {
      maxAmount,
      interestRate = "5",
      termLength = "12",
      title = "Joe's Solar Panels",
    } = this.props;
    const { amount } = this.state;

    console.log('amount', amount);

    return (
      <div className="new-certificate-container">
        <ContentHeader title={title} />
        <div className="new-certificate-item">
          <div className="new-certificate-item-title">Length</div>
          <div className="new-certificate-item-value">{termLength} months</div>
        </div>
        <div className="new-certificate-item">
          <div className="new-certificate-item-title">Interest Rate</div>
          <div className="new-certificate-item-value">{interestRate} %</div>
        </div>
        <Slider
          onChange={this.onChange}
          min={25}
          max={maxAmount}
          type='amount'
        />
        <div className="new-certificate-amount">{`$${amount}`}</div>
        <div className="new-certificate-button">
          <Button text="Create Account" />
        </div>
      </div>
    );
  }
}
