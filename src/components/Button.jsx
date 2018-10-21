import React from "react";

export class Button extends React.PureComponent {
  render() {
    const { onClick, text } = this.props;

    return (
      <div className="button-primary" onClick={onClick}>
        {text}
      </div>
    );
  }
}
