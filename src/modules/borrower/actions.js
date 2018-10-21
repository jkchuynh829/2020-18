import { REMOTE_REQUEST } from "../../middleware/constants";
import {
  createLoanRequest,
  createLoanFailure,
  createLoanSuccess,
  getLoansRequest,
  getLoansFailure,
  getLoansSuccess,
} from "./constants";

export const createLoan = ({
  userId,
  amount,
  purpose,
  termLength,
  termRate,
}) => ({
  type: REMOTE_REQUEST,
  types: {
    request: createLoanRequest,
    failure: createLoanFailure,
    success: createLoanSuccess,
  },
  method: "POST",
  url: "/loans",
  info: { timestamp: new Date().toISOString() },
  data: {
    userId,
    amount,
    purpose,
    termLength,
    termRate,
  },
});

export const getLoans = ({ userId }) => ({
  type: REMOTE_REQUEST,
  types: {
    request: getLoansRequest,
    failure: getLoansFailure,
    success: getLoansSuccess,
  },
  method: "GET",
  url: `/${userId}/loans`,
  info: { timestamp: new Date().toISOString() },
  data: {
    userId,
  },
});
