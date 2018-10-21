import { REMOTE_REQUEST } from "../../middleware/constants";
import { getLoansRequest, getLoansFailure, getLoansSuccess } from "./constants";

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
