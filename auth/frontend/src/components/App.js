import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Login from './Login';
import Register from './Register';
import PrivateRoute from './PrivateRoute';

export default function App() {
  const [token, setToken] = useState('')

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={() => <Login setToken={setToken} />} />
          <Route path="/register" component={Register} />
          <PrivateRoute path="/home" token={token} component={() => <div>{token}</div>} />
        </Switch>
      </Router>
    </div >
  )
}
