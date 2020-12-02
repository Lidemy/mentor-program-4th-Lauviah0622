import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { ThemeProvider } from "styled-components";

import { Provider } from "react-redux";

// import store from "./redux/store";
// import combineReducers from "./redux/reducers";
import combineReducers from './redux/reducers';
import { configureStore } from "@reduxjs/toolkit";

const theme = {
  color: {
    primary: "#88d19d",
  },
  padding: {
    m: "0 20px",
  },
};

const store = configureStore({
  reducer: combineReducers,
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
