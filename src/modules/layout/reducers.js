import { combineReducers } from "redux";
import { reducer as topBarText } from "./reducers/topBarText";

export const reducer = combineReducers({
  topBarText,
});
