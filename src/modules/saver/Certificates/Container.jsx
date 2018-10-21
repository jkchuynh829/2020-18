import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { changeTopBarCopy } from "../../layout/actions";
import { ContentHeader, NewCertificateDetails } from "../../../components";

export class CertificatesContainer extends React.PureComponent {
  componentDidMount() {
    this.props.changeTopBarCopy("Savings Certificates");
  }

  onClickNew = () => {
    this.props.history.push("/user/saver/certificates");
  };

  render() {
    return (
      <div className="saver-certificates-container">
        <ContentHeader title="Open A New Account" />
        <NewCertificateDetails
          title="Joe's Solar Panels"
          completed="50"
          total="100"
          interestRate="5"
          termLength="12"
          description="Malik is a independent goat farmer from Kisumu, Kenya.  He’s looking for investors to help finance some farm equipment."
        />
        <NewCertificateDetails
          title="Joe's Solar Panels"
          completed="50"
          total="100"
          interestRate="5"
          termLength="12"
          description="Malik is a independent goat farmer from Kisumu, Kenya.  He’s looking for investors to help finance some farm equipment."
        />
        <NewCertificateDetails
          title="Joe's Solar Panels"
          completed="50"
          total="100"
          interestRate="5"
          termLength="12"
          description="Malik is a independent goat farmer from Kisumu, Kenya.  He’s looking for investors to help finance some farm equipment."
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export const CertificatesContainerWrapped = withRouter(
  connect(
    mapStateToProps,
    { changeTopBarCopy }
  )(CertificatesContainer)
);
