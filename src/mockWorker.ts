import { setupWorker, graphql } from "msw";
import {
  Task,
  AllTasksQueryResult,
  AddTaskMutationResult,
  AddTaskMutationVariables,
  UpdateTaskStatusVariables,
  DeleteTasksVariables,
} from "./components/graphql";
import {
  configureStore,
  createSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";

function getMockStore(initialTasks: Task[]) {
  let id = 100;
  const entityAdapter = createEntityAdapter<Task>();
  const initialState = entityAdapter.setAll(
    entityAdapter.getInitialState(),
    initialTasks
  );
  const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
      addItem: {
        reducer: entityAdapter.addOne,
        prepare({ title, description }: Pick<Task, "title" | "description">) {
          return {
            payload: {
              __typename: "Task" as const,
              id: ++id,
              title,
              description,
              done: false,
            },
          };
        },
      },
      deleteItem: entityAdapter.removeOne,
      updateItem: entityAdapter.upsertOne,
    },
  });
  const { reducer, actions } = slice;
  const store = configureStore({ reducer: { tasks: reducer } });
  store.subscribe(() => {
    console.log("new store value", store.getState());
  });
  type RootState = ReturnType<typeof store.getState>;
  const selectors = entityAdapter.getSelectors(
    (state: RootState) => state.tasks
  );
  return { actions, selectors, store };
}

export function startMock(scenario?: "error" | "errorOnMutation" | "success") {
  if (!["error", "errorOnMutation"].includes(scenario!)) {
    scenario = "success";
  }
  const postgraphile = graphql.link("http://localhost:5000/graphql");

  const { actions, selectors, store } = getMockStore([
    {
      __typename: "Task",
      id: 1,
      title: "Mock something!",
      description: "Add a first mock",
      done: true,
    },
  ]);

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
    )
  );

  worker.start();
}
