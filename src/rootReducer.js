import { combineReducers } from "redux";
import { reducer as auth } from "./modules/auth/reducers";
import { reducer as layout } from "./modules/layout/reducers";
import { reducer as borrower } from "./modules/borrower/reducers";

export const rootReducer = combineReducers({
  auth,
  borrower,
  layout,
});
