import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import { configureStore } from "./config/configureStore";
import { HashRouter as Router } from "react-router-dom";

import "./styles/index.scss";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router basename="/">
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

if (module.hot && process.env.NODE_ENV === "development") {
  module.hot.accept("./App.js", () => {
    const NextApp = require("./App.js").default;
    ReactDOM.render(<NextApp />, document.getElementById("root"));
  });
}
