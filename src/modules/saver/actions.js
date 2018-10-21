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
  getAllSavingsAccountsRequest,
  getAllSavingsAccountsFailure,
  getAllSavingsAccountsSuccess,
  paySavingsAccountRequest,
  paySavingsAccountFailure,
  paySavingsAccountSuccess,
} from "./constants";

export const getLoansByUserId = ({ userId }) => ({
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

export const getLoans = () => ({
  type: REMOTE_REQUEST,
  types: {
    request: getLoansRequest,
    failure: getLoansFailure,
    success: getLoansSuccess,
  },
  method: "GET",
  url: `/loans`,
  info: { timestamp: new Date().toISOString() },
  data: {},
});

export const getSavingsAccountsByUserId = ({ userId }) => ({
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

export const getSavingsAccounts = () => ({
  type: REMOTE_REQUEST,
  types: {
    request: getAllSavingsAccountsRequest,
    failure: getAllSavingsAccountsFailure,
    success: getAllSavingsAccountsSuccess,
  },
  method: "GET",
  url: `/savings_accounts`,
  info: { timestamp: new Date().toISOString() },
  data: {},
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

export const paySavingsAccount = ({ amount, description }) => ({
  type: REMOTE_REQUEST,
  types: {
    request: paySavingsAccountRequest,
    failure: paySavingsAccountFailure,
    success: paySavingsAccountSuccess,
  },
  method: "POST",
  url: "/pay",
  info: { timestamp: new Date().toISOString() },
  data: {
    amount,
    description,
  },
});
