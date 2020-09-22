import { setupServer } from "msw/node";
import { mockRequests } from "./mockRequests";
import { getMockStore } from "./mockStore";
import { bindActionCreators } from "@reduxjs/toolkit";

export function mockServer() {
  const storeHelpers = getMockStore([]);
  const boundActions = bindActionCreators(
    storeHelpers.actions,
    storeHelpers.store.dispatch
  );

  const server = setupServer(
    ...mockRequests("success", storeHelpers).requestHandlers
  );

  return { server, boundActions, ...storeHelpers };
}
