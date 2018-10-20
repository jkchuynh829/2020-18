import { loginSuccess, logoutSuccess, registerSuccess } from "./constants";

export const login = () => {
  return {
    type: loginSuccess,
  };
};

export const logout = () => {
  return {
    type: logoutSuccess,
  };
};

export const register = userType => {
  return {
    type: registerSuccess,
    userType,
  };
};
