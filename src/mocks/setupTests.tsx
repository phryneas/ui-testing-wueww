import React from "react";
import { render } from "@testing-library/react";
import { createClient, Provider } from "urql";
import { mockServer } from "./mockServer";

export function setupTests() {
  const { boundActions, server, store, selectors } = mockServer();

  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    boundActions.reset();
  });
  afterAll(() => server.close());

  function renderWithProvider(children: React.ReactChild) {
    const client = createClient({
      url: "http://localhost:5000/graphql",
    });

    return render(<Provider value={client}> {children} </Provider>);
  }
  return { store, selectors, renderWithProvider, boundActions, server };
}
