import React from "react";

export class ButtonSmall extends React.PureComponent {
  render() {
    const { onClick, text, disabled = false } = this.props;
    const classNames = `button-primary-small ${
      disabled ? "button-primary-small-disabled" : ""
    }`;

    return (
      <div className={classNames} onClick={disabled ? null : onClick}>
        {text}
      </div>
    );
  }
}
