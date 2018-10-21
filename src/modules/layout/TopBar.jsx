import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

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
    {}
  )(TopBar)
);
