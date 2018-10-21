import { getAllSavingsAccountsSuccess } from "../constants";

const initialState = [];

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case getAllSavingsAccountsSuccess: {
      return action.response.data;
    }

    default:
      return state;
  }
};
