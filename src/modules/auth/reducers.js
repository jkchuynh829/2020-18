import { combineReducers } from "redux";
import { reducer as isLoggedIn } from "./reducers/isLoggedIn";
import { reducer as user } from "./reducers/user";

export const AuthReducer = combineReducers({
  isLoggedIn,
  user,
});
