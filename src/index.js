import React from "react";
import ReactDOM from "react-dom";
// import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./styles/index.scss";
// import { hot } from "react-hot-loader";

ReactDOM.render(<App />, document.getElementById("root"));

if (module.hot && process.env.NODE_ENV === "development") {
  module.hot.accept("./App.js", () => {
    const NextApp = require("./App.js").default;
    ReactDOM.render(<NextApp />, document.getElementById("root"));
  });
}
// export default hot(module)(Root);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
