import { setupWorker } from "msw";
import { mockRequests, MockScenario } from "./mockRequests";
import { getMockStore } from "./mockStore";

const initialTasks = [
  {
    __typename: "Task",
    id: 1,
    title: "Mock something!",
    description: "Add a first mock",
    done: true,
  },
] as const;

export function startWorker(scenario: MockScenario | string) {
  const worker = setupWorker(
    ...mockRequests(scenario, getMockStore(initialTasks)).requestHandlers
  );

  return worker.start();
}
