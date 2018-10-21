import {
  loginSuccess,
  logoutSuccess,
  registerSuccess,
  registerFailure,
  registerRequest,
} from "./constants";
import { REMOTE_REQUEST } from "../../middleware/constants";

export const login = userId => {
  return {
    type: loginSuccess,
    userId,
  };
};

export const logout = () => {
  return {
    type: logoutSuccess,
  };
};

export const register = ({ firstName, lastName, email }) => ({
  type: REMOTE_REQUEST,
  types: {
    request: registerRequest,
    failure: registerFailure,
    success: registerSuccess,
  },
  method: "POST",
  url: "/create_user",
  info: { timestamp: new Date().toISOString() },
  data: {
    firstName,
    lastName,
    email,
  },
});
