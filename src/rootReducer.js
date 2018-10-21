import { combineReducers } from "redux";
import { reducer as auth } from "./modules/auth/reducers";
import { reducer as layout } from "./modules/layout/reducers";
import { reducer as borrower } from "./modules/borrower/reducers";
import { reducer as saver } from "./modules/saver/reducers";

export const rootReducer = combineReducers({
  auth,
  borrower,
  layout,
  saver,
});
