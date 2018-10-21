import { REMOTE_REQUEST } from "../../middleware/constants";
import {
  getLoansRequest,
  getLoansFailure,
  getLoansSuccess,
  createSavingsAccountRequest,
  createSavingsAccountFailure,
  createSavingsAccountSuccess,
  getSavingsAccountsRequest,
  getSavingsAccountsFailure,
  getSavingsAccountsSuccess,
} from "./constants";

export const getLoans = ({ userId }) => ({
  type: REMOTE_REQUEST,
  types: {
    request: getLoansRequest,
    failure: getLoansFailure,
    success: getLoansSuccess,
  },
  method: "GET",
  url: `/loans`,
  info: { timestamp: new Date().toISOString() },
  data: {
    userId,
  },
});

export const getSavingsAccounts = ({ userId }) => ({
  type: REMOTE_REQUEST,
  types: {
    request: getSavingsAccountsRequest,
    failure: getSavingsAccountsFailure,
    success: getSavingsAccountsSuccess,
  },
  method: "GET",
  url: `/${userId}/savings_accounts`,
  info: { timestamp: new Date().toISOString() },
  data: {
    userId,
  },
});

export const createSavingsAccount = ({
  userId,
  loanId,
  amount,
  termLength,
  termRate,
}) => ({
  type: REMOTE_REQUEST,
  types: {
    request: createSavingsAccountRequest,
    failure: createSavingsAccountFailure,
    success: createSavingsAccountSuccess,
  },
  method: "POST",
  url: "/savings_accounts",
  info: { timestamp: new Date().toISOString() },
  data: {
    userId,
    amount,
    loanId,
    termLength,
    termRate,
  },
});
