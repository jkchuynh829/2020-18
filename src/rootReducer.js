import { combineReducers } from "redux";
import { reducer as auth } from "./modules/auth/reducers";
import { reducer as layout } from "./modules/layout/reducers";
import { reducer as borrower } from "./modules/borrower/reducers";
import { reducer as saver } from "./modules/saver/reducers";
import { logoutSuccess } from "./modules/auth/constants";

export const reducer = combineReducers({
  auth,
  borrower,
  layout,
  saver,
});

export const rootReducer = (state, action) => {
  if (action.type === logoutSuccess) {
    state = {};
  }

  return reducer(state, action);
};
