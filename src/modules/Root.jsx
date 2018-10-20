import React, { Component } from "react";
import { Sidebar } from "./layout/Sidebar";
import { RouteContainer } from "./layout/RouteContainer";

class Root extends Component {
  state = {
    isSidebarVisible: true,
  };

  toggleSidebar = () => {
    this.setState({ isSidebarVisible: !this.state.isSidebarVisible });
  };

  render() {
    const { isSidebarVisible } = this.state;
    const classNames = isSidebarVisible
      ? "root-container"
      : "root-container-no-sidebar";

    return (
      <div className={classNames}>
        {isSidebarVisible && <Sidebar />}
        <RouteContainer isSidebarVisible={isSidebarVisible} />
      </div>
    );
  }
}

export default Root;
