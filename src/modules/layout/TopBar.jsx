import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../auth/actions";

export class TopBar extends React.PureComponent {
  onBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { topBarText } = this.props;

    return (
      <div className="top-bar-container">
        <div className="top-bar-icon">
          <i className="fas fa-chevron-left" onClick={this.onBack} />
        </div>
        <div className="top-bar-text">{topBarText}</div>
        <div className="register-top-bar-sign-out-icon">
          <i className="fas fa-sign-out-alt" onClick={this.props.logout} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  topBarText: state.layout.topBarText,
});

export const TopBarWrapped = withRouter(
  connect(
    mapStateToProps,
    { logout }
  )(TopBar)
);
