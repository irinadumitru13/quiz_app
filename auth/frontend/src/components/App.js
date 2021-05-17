import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";

import Login from "./Login";
import Register from "./Register";
import PrivateRoute from "./PrivateRoute";
import Home from "./Home";

export default function App() {
  const [cookie, setCookie] = useCookies(["token", "sessionInfo"]);

  const saveToken = (tokenString) => {
    setCookie("token", tokenString, { path: "/" });
    let decoded = jwt_decode(tokenString);
    setCookie("session_info", decoded, { path: "/" });
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
          <PrivateRoute path="/home" token={cookie.token} component={Home} />
        </Switch>
      </Router>
    </div>
  );
}
