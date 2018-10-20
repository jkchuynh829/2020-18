import React from "react";

export class TopBar extends React.PureComponent {
  render() {
    const { toggleSidebar } = this.props;

    return (
      <div className="top-bar-container">
        <i className="fas fa-bars" onClick={toggleSidebar} />
      </div>
    );
  }
}
