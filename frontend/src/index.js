import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import reducer from "./Reducers/index";
import thunk from "redux-thunk";

import App from "./App";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const mystore = createStore(
  reducer,
  {},
  composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={mystore}>
    <App />
  </Provider>,
  document.getElementById("root")
);
