import React from "react";

export class Sidebar extends React.PureComponent {
  render() {
    return (
      <div className="sidebar-container">
        <div className="sidebar-links">
          <div className="sidebar-link">My Accounts</div>
          <div className="sidebar-link">Advice</div>
          <div className="sidebar-link">Apply</div>
          <div className="sidebar-link">Profile</div>
        </div>
      </div>
    );
  }
}
