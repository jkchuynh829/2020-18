import { registerSuccess } from "../constants";

const initialState = {};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case registerSuccess: {
      return {
        type: action.userType,
      };
    }

    default:
      return state;
  }
};
