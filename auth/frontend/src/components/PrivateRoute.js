import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function PrivateRoute({
  permissionLevel,
  component: Component,
  ...rest
}) {
  const [cookie] = useCookies(["token", "session_info"]);

  if (
    permissionLevel !== undefined &&
    cookie.session_info.user_permissions < permissionLevel
  ) {
    return <Redirect to="/" />;
  }

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
