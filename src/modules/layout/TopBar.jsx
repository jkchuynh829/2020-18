import React from "react";
import { connect } from "react-redux";

export class TopBar extends React.PureComponent {
  render() {
    const { toggleSidebar, topBarText } = this.props;

    return (
      <div className="top-bar-container">
        <div className="top-bar-text">
          <i className="fas fa-chevron-left" onClick={toggleSidebar} />
        </div>
        <div className="top-bar-text">{topBarText}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  topBarText: state.layout.topBarText,
});

export const TopBarWrapped = connect(
  mapStateToProps,
  {}
)(TopBar);
