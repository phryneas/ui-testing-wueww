import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { createClient, Provider } from "urql";

import { startMock } from "./mockWorker";

const client = createClient({
  url: "http://localhost:5000/graphql",
});

const renderApp = () =>
  ReactDOM.render(
    <React.StrictMode>
      <Provider value={client}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );

const params = new URLSearchParams(window.location.search);

if (params.has("mock")) {
  const mock = params.get("mock");

  // Technically speaking, you should not have to do this, but it doesn't hurt.
  // msw will try to intercept fetch before the service worker is activated and then replay requests,
  // but we've found that in some environments this isn't guaranteed (another rabbit hole to go down :tada:). 
  // So, this is a nice way to ensure that the worker registration promise is resolved 
  // regardless of environment oddities (local vs CI vs teammate local etc)
  startMock(mock as any).then(() => renderApp());
} else {
  renderApp();
}
