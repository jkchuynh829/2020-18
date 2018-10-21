import { getSavingsAccountsSuccess } from "../constants";

const initialState = [];

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case getSavingsAccountsSuccess: {
      return action.response.data;
    }

    default:
      return state;
  }
};
