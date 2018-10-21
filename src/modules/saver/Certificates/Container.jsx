import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { changeTopBarCopy } from "../../layout/actions";
import { getLoans } from "../../borrower/actions";
import { ContentHeader, NewCertificateDetails } from "../../../components";

export class CertificatesContainer extends React.PureComponent {
  componentDidMount() {
    this.props.getLoans({ userId: "5" });
    this.props.changeTopBarCopy("Savings Certificates");
  }

  onClickNew = () => {
    this.props.history.push("/user/saver/certificates");
  };

  render() {
    const { loans } = this.props;

    return (
      <div className="saver-certificates-container">
        <ContentHeader title="Open A New Account" />
        {loans.map(loan => {
          const { purpose, amount, term_length } = loan;

          return (
            <NewCertificateDetails
              title={purpose.substr(0, 13)}
              completed="50"
              total={amount}
              interestRate="5"
              termLength={term_length}
              description={purpose}
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loans: state.borrower.loans,
});

export const CertificatesContainerWrapped = withRouter(
  connect(
    mapStateToProps,
    { changeTopBarCopy, getLoans }
  )(CertificatesContainer)
);
