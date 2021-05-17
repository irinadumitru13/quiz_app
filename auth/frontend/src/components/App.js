import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useCookies } from "react-cookie";

import Login from "./Login";
import Register from "./Register";
import PrivateRoute from "./PrivateRoute";

export default function App() {
  const [cookie, setCookie] = useCookies(["token"]);

  const saveToken = (tokenString) => {
    setCookie("token", tokenString, { path: "/" });
  };

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            component={() => <Login setToken={saveToken} />}
          />
          <Route path="/register" component={Register} />
          <PrivateRoute
            path="/home"
            token={cookie.token}
            component={() => <div>Logged in!</div>}
          />
        </Switch>
      </Router>
    </div>
  );
}
