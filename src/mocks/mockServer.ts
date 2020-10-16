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

  const { requestHandlers, changeScenario } = mockRequests(
    "success",
    storeHelpers
  );
  const server = setupServer(...requestHandlers);

  return { server, boundActions, changeScenario, ...storeHelpers };
}
