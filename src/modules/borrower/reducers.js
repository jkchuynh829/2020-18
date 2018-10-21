import { combineReducers } from "redux";
import { reducer as loans } from "./reducers/loans";

export const reducer = combineReducers({
  loans,
});
