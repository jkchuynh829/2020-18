import { getUsersSuccess } from "../constants";

const initialState = [];

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case getUsersSuccess: {
      return action.response.data;
    }

    default:
      return state;
  }
};
