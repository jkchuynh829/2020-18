import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistReducer } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import { appMiddleware } from "../middleware";
import { rootReducer } from "../rootReducer";

const persistConfig = {
  key: "equalitee_root",
  stateReconciler: autoMergeLevel2,
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares = [thunk, appMiddleware];

export function configureStore() {
  if (process.env.NODE_ENV === "development") {
    const store = createStore(
      persistedReducer,
      composeWithDevTools(applyMiddleware(...middlewares))
    );

    // if (module.hot) {
    //   module.hot.accept("../rootReducer", () => {
    //     const nextRootReducer = require("../rootReducer").default;
    //     const persistedReducerHot = persistReducer(
    //       persistConfig,
    //       nextRootReducer
    //     );
    //     store.replaceReducer(persistedReducerHot);
    //   });
    // }

    return store;
  }

  return createStore(persistedReducer, applyMiddleware(...middlewares));
}
