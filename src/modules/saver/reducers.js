import { combineReducers } from "redux";
import { reducer as loans } from "./reducers/loans";
import { reducer as savingsAccounts } from "./reducers/savingsAccounts";
import { reducer as allSavingsAccounts } from "./reducers/allSavingsAccounts";
import { reducer as redirectUrl } from "./reducers/redirectUrl";

export const reducer = combineReducers({
  allSavingsAccounts,
  loans,
  redirectUrl,
  savingsAccounts,
});
