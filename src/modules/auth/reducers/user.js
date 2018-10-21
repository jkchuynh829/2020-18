import { registerSuccess, loginSuccess } from "../constants";

const initialState = {};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case registerSuccess: {
      return {
        type: action.userType,
      };
    }

    case loginSuccess: {
      const { userId } = action;
      let userType;

      if (userId === "sandra@gmail.com") {
        userType = "saver";
      }

      if (userId === "joseph@gmail.com") {
        userType = "borrower";
      }

      return {
        userId: userId,
        type: userType,
      };
    }

    default:
      return state;
  }
};
