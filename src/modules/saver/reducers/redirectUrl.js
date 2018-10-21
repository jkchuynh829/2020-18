import { paySavingsAccountSuccess } from "../constants";

const initialState = "";

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case paySavingsAccountSuccess:
      return action.response.data;

    default:
      return state;
  }
};
