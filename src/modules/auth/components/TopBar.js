import React from "react";

export class TopBar extends React.PureComponent {
  render() {
    return (
      <div className="register-top-bar">
        <div className="register-top-bar-back-icon">
          <i className="fas fa-chevron-left" />
        </div>
        <div className="register-top-bar-text">Choose a plan</div>
      </div>
    );
  }
}
