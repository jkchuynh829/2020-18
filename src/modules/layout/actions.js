import { changeTopBarText } from "./constants";

export const changeTopBarCopy = text => ({
  type: changeTopBarText,
  text,
});
