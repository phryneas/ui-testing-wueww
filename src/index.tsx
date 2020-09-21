import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { createClient, Provider } from "urql";

import { startMock } from "./mockWorker";

const params = new URLSearchParams(window.location.search);
if (params.has("mock")) {
  const mock = params.get("mock");
  startMock(mock as any);
}

const client = createClient({
  url: "http://localhost:5000/graphql",
});

ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
