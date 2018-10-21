import React from "react";

export class UserTypeOption extends React.PureComponent {
  render() {
    const {
      title,
      description,
      userType,
      selectedUserType,
      onClick,
    } = this.props;

    const isSelectedUserType = userType === selectedUserType;
    const titleClassNames =
      selectedUserType !== "" ? "user-type-title-opaque" : "user-type-title";

    return (
      <div className="user-type-list-item" onClick={onClick}>
        {isSelectedUserType ? (
          <div className="selected-user-type">
            <div className="selected-user-type-title">{title}</div>
            <div className="selected-user-type-description">{description}</div>
          </div>
        ) : (
          <div className={titleClassNames}>{title}</div>
        )}
      </div>
    );
  }
}
