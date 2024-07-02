import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store";
import { Provider } from "react-redux";
import { clearAuthentication } from "./redux/slices/authSlice.js";
import setupAxiosInterceptors from "./axios/axios-interceptor.jsx";
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { bindActionCreators } from "redux";
import 'react-toastify/dist/ReactToastify.css';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() =>
  actions.clearAuthentication("login.error.unauthorized")
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <App />
  </Provider>
);
