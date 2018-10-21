import { changeTopBarText } from "../constants";

const initialState = "";

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case changeTopBarText:
      return action.text;

    default:
      return state;
  }
};
