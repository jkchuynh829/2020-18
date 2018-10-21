import { registerSuccess, getUserSuccess } from "../constants";

const initialState = {};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case registerSuccess: {
      return {
        type: action.userType,
      };
    }

    case getUserSuccess: {
      const { response } = action;
      const user = response.data[0];

      return user;
    }

    default:
      return state;
  }
};
