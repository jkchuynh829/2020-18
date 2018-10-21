import React from "react";

export class TextField extends React.PureComponent {
  state = {
    value: "",
  };

  onChange = e => {
    const { onChange, field } = this.props;
    onChange(field, e.currentTarget.value);
  };

  render() {
    const { value, placeholder, disabled = false } = this.props;

    return (
      <input
        disabled={disabled}
        className="text-field"
        placeholder={placeholder}
        value={value}
        onChange={this.onChange}
      />
    );
  }
}
