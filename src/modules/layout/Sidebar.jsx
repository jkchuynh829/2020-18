import React from "react";
import { connect } from "react-redux";

import { logout } from "../auth/actions";

export class Sidebar extends React.PureComponent {
  render() {
    const { logout } = this.props;

    return (
      <div className="sidebar-container">
        <div className="sidebar-links">
          <div className="sidebar-link">My Accounts</div>
          <div className="sidebar-link">Advice</div>
          <div className="sidebar-link">Apply</div>
          <div className="sidebar-link">Profile</div>
          <div className="sidebar-link" onClick={logout}>
            Logout
          </div>
        </div>
      </div>
    );
  }
}

export const SidebarWrapped = connect(
  () => ({}),
  { logout }
)(Sidebar);
