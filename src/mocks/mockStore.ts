import { Task } from "../components/graphql";
import {
  configureStore,
  createSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";

export type MockStoreResult = ReturnType<typeof getMockStore>;

export function getMockStore(initialTasks: readonly Task[]) {
  let id = 100;
  const entityAdapter = createEntityAdapter<Task>();
  const initialState = entityAdapter.setAll(entityAdapter.getInitialState(), [
    ...initialTasks,
  ]);
  const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
      reset: () => initialState,
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
      setAll: entityAdapter.setAll,
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
