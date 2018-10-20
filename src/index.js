import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/index.scss";

ReactDOM.render(<App />, document.getElementById("root"));

if (module.hot && process.env.NODE_ENV === "development") {
  module.hot.accept("./App.js", () => {
    const NextApp = require("./App.js").default;
    ReactDOM.render(<NextApp />, document.getElementById("root"));
  });
}
