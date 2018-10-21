import { combineReducers } from "redux";
import { reducer as auth } from "./modules/auth/reducers";
import { reducer as layout } from "./modules/layout/reducers";

export const rootReducer = combineReducers({
  auth,
  layout,
});
