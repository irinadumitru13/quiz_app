import React from "react";
import ReactDOM from "react-dom";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import { CookiesProvider } from "react-cookie";
import AlertTemplate from "react-alert-template-basic";

import App from "./components/App";

const options = {
  position: positions.TOP_RIGHT,
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE,
};

const Root = () => {
  return (
    <CookiesProvider>
      <AlertProvider template={AlertTemplate} {...options}>
        <App />
      </AlertProvider>
    </CookiesProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
