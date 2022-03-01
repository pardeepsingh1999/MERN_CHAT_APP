import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

import App from "./App";
import "./index.css";
import { persistor, store } from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<div />} persistor={persistor}>
      <BrowserRouter>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
