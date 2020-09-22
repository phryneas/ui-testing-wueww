import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { createClient, Provider } from "urql";

import { startWorker } from "./mocks/mockWorker";

if (process.env.NODE_ENV === "development") {
  const params = new URLSearchParams(window.location.search);
  if (params.has("mock")) {
    const mock = params.get("mock")!;
    startWorker(mock).then(renderApp);
  } else {
    renderApp();
  }
} else {
  renderApp();
}

function renderApp() {
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
}
