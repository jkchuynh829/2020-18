import {
  loginSuccess,
  logoutSuccess,
  registerSuccess,
  registerFailure,
  registerRequest,
  getUsersRequest,
  getUsersFailure,
  getUsersSuccess,
  getUserRequest,
  getUserFailure,
  getUserSuccess,
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

export const register = ({ firstName, lastName, email, userType }) => ({
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
    userType,
  },
});

export const getUsers = () => ({
  type: REMOTE_REQUEST,
  types: {
    request: getUsersRequest,
    failure: getUsersFailure,
    success: getUsersSuccess,
  },
  method: "GET",
  url: "/users",
  info: { timestamp: new Date().toISOString() },
  data: {},
});

export const getUser = email => ({
  type: REMOTE_REQUEST,
  types: {
    request: getUserRequest,
    failure: getUserFailure,
    success: getUserSuccess,
  },
  method: "GET",
  params: { email },
  url: "/users",
  info: { timestamp: new Date().toISOString() },
  data: {},
});
