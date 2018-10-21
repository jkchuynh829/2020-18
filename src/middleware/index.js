import * as constants from "./constants";
import { remote } from "./remote";
import { isEmpty, reduce } from "lodash";

export function encodeQueryParams(queryParams) {
  if (isEmpty(queryParams)) {
    return "";
  }

  const params = reduce(
    queryParams,
    (acc, value, key) => [
      ...acc,
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    ],
    []
  );

  return params.length > 0 ? `?${params.join("&")}` : "";
}

export const appMiddleware = ({ getState }) => (
  next
  // tslint:disable-next-line:no-any
) => action => {
  // tslint:disable-next-line:no-any
  const state = getState();
  const bearerToken = state.auth.bearerToken;

  switch (action.type) {
    case constants.REMOTE_REQUEST: {
      const { url, method, schema, data, types, info, params } = action;
      const { request, failure, success } = types;

      const actionWith = localAction => {
        const finalAction = { ...action, ...localAction };

        return finalAction;
      };

      // 1st, we dispatch the request itself
      next(actionWith({ type: request, info }));

      return remote({
        bearerToken,
        config: { method, body: data },
        schema,
        url: `${url}${encodeQueryParams(params)}`,
      }).then(
        // tslint:disable-next-line:no-any
        response => {
          next(actionWith({ type: success, response, info }));
        },
        error => {
          if (error === "unauthorized") {
            next({ type: "AUTH::USER_LOGOUT" });
          }
          next(actionWith({ type: failure, error, info }));

          return;
        }
      );
    }

    default: {
      return next(action);
    }
  }
};
