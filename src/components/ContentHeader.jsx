import React from "react";

export class ContentHeader extends React.PureComponent {
  render() {
    const { title } = this.props;

    return <div className="content-header">{title}</div>;
  }
}
