import { setupWorker, graphql } from "msw";
import {
  AllTasksQueryResult,
  AddTaskMutationResult,
  AddTaskMutationVariables,
  UpdateTaskStatusVariables,
  DeleteTasksVariables,
} from "./components/graphql";

export function startMock(scenario?: "error" | "errorOnMutation" | "success") {
  if (!["error", "errorOnMutation"].includes(scenario!)) {
    scenario = "success";
  }
  const postgraphile = graphql.link("http://localhost:5000/graphql");

  const worker = setupWorker(
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
                nodes: [
                  {
                    id: 1,
                    title: "I'm mocked!",
                    description: "Add a first mock",
                    done: true,
                  },
                ],
              },
            })
      );
    }),
    postgraphile.mutation<AddTaskMutationResult, AddTaskMutationVariables>(
      "AddTask",
      (req, res, ctx) => {
        return res(
          scenario === "error" || scenario === "errorOnMutation"
            ? ctx.errors([
                {
                  message:
                    "Hit a mocked error while executing important fake database work!",
                },
              ])
            : ctx.data({
                task: {
                  id: 1,
                  ...req.variables,
                  done: false,
                },
              })
        );
      }
    ),
    postgraphile.mutation<AddTaskMutationResult, UpdateTaskStatusVariables>(
      "UpdateDone",
      (req, res, ctx) => {
        return res(
          scenario === "error" || scenario === "errorOnMutation"
            ? ctx.errors([
                {
                  message:
                    "Hit a mocked error while executing important fake database work!",
                },
              ])
            : ctx.data({
                task: {
                  title: "Do something",
                  description: "With various specific details",
                  ...req.variables,
                },
              })
        );
      }
    ),

    postgraphile.mutation<{ deletedTaskId: number }, DeleteTasksVariables>(
      "DeleteTask",
      (req, res, ctx) => {
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
    )
  );

  worker.start();
}
