import { combineReducers } from "redux";
import { reducer as loans } from "./reducers/loans";
import { reducer as savingsAccounts } from "./reducers/savingsAccounts";

export const reducer = combineReducers({
  loans,
  savingsAccounts,
});
