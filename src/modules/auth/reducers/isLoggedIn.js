import { loginSuccess, logoutSuccess } from "../constants";

const initialState = false;

export const reducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case loginSuccess: {
      return true;
    }

    case logoutSuccess: {
      return false;
    }

    default:
      return state;
  }
};
