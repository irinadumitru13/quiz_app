import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function PrivateRoute({ component: Component, ...rest }) {
  const [cookie] = useCookies(["token"]);

  return (
    <Route
      {...rest}
      render={(props) =>
        cookie.token !== undefined ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}
