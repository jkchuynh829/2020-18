import { createLoanSuccess, getLoansSuccess } from "../constants";

const initialState = [];

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case createLoanSuccess: {
      return action.response.data;
    }

    case getLoansSuccess: {
      return action.response.data;
    }

    default:
      return state;
  }
};
