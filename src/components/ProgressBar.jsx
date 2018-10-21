import React from "react";

export class ProgressBar extends React.PureComponent {
  render() {
    const { title, completed, total } = this.props;
    const progressWidth = (completed / total) * 100;

    return (
      <div className="progress-bar-container">
        <div className="progress-bar-info-title">{title}</div>
        <div className="progress-bar-info-stats">
          ${completed} / ${total} funded
        </div>
        <div className="progress-bar-bar">
          <div
            className="progress-bar-completed"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>
    );
  }
}
