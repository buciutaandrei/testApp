/* eslint-disable */
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import { makeObservable, observable, action } from "mobx-react";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <>
    <Router>
      <App />
    </Router>
  </>,
  document.getElementById("root")
);
