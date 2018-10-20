import { combineReducers } from "redux";
import { AuthReducer as auth } from "./modules/auth/reducers";

export const rootReducer = combineReducers({
  auth,
});
