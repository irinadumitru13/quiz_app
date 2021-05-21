import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
import { makeStyles } from "@material-ui/core/styles";
import jwt_decode from "jwt-decode";

import MenuAppBar from "./MenuAppBar";
import Login from "./Login";
import Register from "./Register";
import PrivateRoute from "./PrivateRoute";
import Home from "./Home";
import Challenge from "./Challenge";
import Editor from "./Editor";

const useStyles = makeStyles((theme) => ({
  app: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
}));

export default function App() {
  const classes = useStyles();
  const [cookie, setCookie] = useCookies(["token", "sessionInfo"]);

  const saveToken = (tokenString) => {
    let decoded = jwt_decode(tokenString);
    setCookie("token", tokenString, { path: "/" });
    setCookie("session_info", decoded, { path: "/" });
  };

  return (
    <div className={classes.app}>
      <Router>
        <MenuAppBar auth={cookie.token !== undefined} />
        <Switch>
          <Route
            exact
            path="/login"
            component={() => <Login setToken={saveToken} />}
          />
          <Route path="/register" component={Register} />
          <PrivateRoute
            path="/quiz/:id"
            token={cookie.token}
            component={Challenge}
          />
          <PrivateRoute
            path="/edit/:id"
            token={cookie.token}
            component={Editor}
          />
          <PrivateRoute path="/" token={cookie.token} component={Home} />
        </Switch>
      </Router>
    </div>
  );
}
