import { graphql } from "msw";
import {
  AllTasksQueryResult,
  AddTaskMutationResult,
  AddTaskMutationVariables,
  UpdateTaskStatusVariables,
  DeleteTasksVariables,
} from "../components/graphql";
import { MockStoreResult } from "./mockStore";

const allScencarios = ["error", "errorOnMutation", "success"] as const;
export type MockScenario = typeof allScencarios[number];

function isMockScenario(s: string): s is MockScenario {
  return allScencarios.includes(s as any);
}

export function mockRequests(
  _scenario: MockScenario | string,
  mockStore: MockStoreResult
) {
  const scenario = isMockScenario(_scenario) ? _scenario : "success";

  const postgraphile = graphql.link("http://localhost:5000/graphql");

  const { actions, selectors, store } = mockStore;

  const requestHandlers = [
    postgraphile.query<AllTasksQueryResult, {}>("AllTasks", (req, res, ctx) => {
      return res(
        scenario === "error"
          ? ctx.errors([
              {
                message:
                  "Hit a mocked error while executing important fake database work!",
              },
            ])
          : ctx.data({
              allTasks: {
                nodes: selectors.selectAll(store.getState()),
              },
            })
      );
    }),
    postgraphile.mutation<AddTaskMutationResult, AddTaskMutationVariables>(
      "AddTask",
      (req, res, ctx) => {
        const newTask = store.dispatch(actions.addItem(req.variables));

        return res(
          scenario === "error" || scenario === "errorOnMutation"
            ? ctx.errors([
                {
                  message:
                    "Hit a mocked error while executing important fake database work!",
                },
              ])
            : ctx.data({
                task: selectors.selectById(
                  store.getState(),
                  newTask.payload.id
                )!,
              })
        );
      }
    ),
    postgraphile.mutation<AddTaskMutationResult, UpdateTaskStatusVariables>(
      "UpdateDone",
      (req, res, ctx) => {
        store.dispatch(
          actions.updateItem({
            ...selectors.selectById(store.getState(), req.variables.id)!,
            ...req.variables,
          })
        );
        return res(
          scenario === "error" || scenario === "errorOnMutation"
            ? ctx.errors([
                {
                  message:
                    "Hit a mocked error while executing important fake database work!",
                },
              ])
            : ctx.data({
                task: selectors.selectById(store.getState(), req.variables.id)!,
              })
        );
      }
    ),

    postgraphile.mutation<{ deletedTaskId: number }, DeleteTasksVariables>(
      "DeleteTask",
      (req, res, ctx) => {
        store.dispatch(actions.deleteItem(req.variables.id));
        return res(
          scenario === "error" || scenario === "errorOnMutation"
            ? ctx.errors([
                {
                  message:
                    "Hit a mocked error while executing important fake database work!",
                },
              ])
            : ctx.data({
                deletedTaskId: req.variables.id,
              })
        );
      }
    ),
  ];

  return {
    requestHandlers,
    reset() {
      store.dispatch(actions.reset());
    },
  };
}
