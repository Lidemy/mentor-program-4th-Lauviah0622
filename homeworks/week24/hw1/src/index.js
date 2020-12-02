import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Blog from "./components/Blog";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import rootReducer from './redux/reducers';
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({reducer: rootReducer});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Blog />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
