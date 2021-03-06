import { combineReducers } from "redux";
import { reducer as isLoggedIn } from "./reducers/isLoggedIn";
import { reducer as user } from "./reducers/user";
import { reducer as users } from "./reducers/users";

export const reducer = combineReducers({
  isLoggedIn,
  user,
  users,
});
