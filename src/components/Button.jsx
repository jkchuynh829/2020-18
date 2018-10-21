import React from "react";

export class Button extends React.PureComponent {
  render() {
    const { onClick, text, disabled = false } = this.props;
    const classNames = `button-primary ${
      disabled ? "button-primary-disabled" : ""
    }`;

    return (
      <div className={classNames} onClick={disabled ? null : onClick}>
        {text}
      </div>
    );
  }
}
