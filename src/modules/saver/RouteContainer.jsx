import React from "react";
import { Route, withRouter } from "react-router-dom";
import { DashboardContainerWrapped as Dashboard } from "./Dashboard/Container";
import { CertificatesContainerWrapped as Certificates } from "./Certificates/Container";
import { NewCertificate } from "./Certificates/NewCertificate";

export class SaverContainer extends React.PureComponent {
  render() {
    return (
      <div className="saver-container">
        <Route path="/user/saver" exact={true} component={Dashboard} />
        <Route
          path="/user/saver/certificates"
          exact={true}
          component={Certificates}
        />
        <Route
          path="/user/saver/certificates/:id"
          exact={true}
          component={NewCertificate}
        />
      </div>
    );
  }
}

export const SaverContainerWrapped = withRouter(SaverContainer);
