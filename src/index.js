import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { RootWrapped as Root } from "./modules/Root";
import { configureStore } from "./config/configureStore";
import { HashRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

import "./styles/index.scss";

const store = configureStore();
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router basename="/">
        <Root />
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

if (module.hot && process.env.NODE_ENV === "development") {
  module.hot.accept("./modules/Root.jsx", () => {
    const NextApp = require("./modules/Root.jsx").default;
    ReactDOM.render(<NextApp />, document.getElementById("root"));
  });
}
