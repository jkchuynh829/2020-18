import React from "react";
import { TopBar } from "./TopBar";
import { SidebarWrapped as Sidebar } from "./Sidebar";
import { RouteContainerWrapped as RouteContainer } from "./RouteContainer";

export class Container extends React.PureComponent {
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
        <TopBar toggleSidebar={this.toggleSidebar} />
        {isSidebarVisible && <Sidebar />}
        <RouteContainer />
      </div>
    );
  }
}
