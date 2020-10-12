import React from "react";
import "@testing-library/jest-dom/extend-expect";
import {
  screen,
  getByRole,
  fireEvent,
  waitFor,
  getByLabelText,
} from "@testing-library/dom";
import { setupTests } from "../mocks/setupTests";
import { TasksList } from "./TasksList";

const demoTask = {
  __typename: "Task" as const,
  id: 1,
  title: "Mock something!",
  description: "Add a first mock",
  done: true,
};

const demoTask2 = {
  __typename: "Task" as const,
  id: 2,
  title: "Mock something else!",
  description: "Add many more mocks",
  done: false,
};

const { store, selectors, renderWithProvider, boundActions } = setupTests();

test("renders a list", async () => {
  boundActions.setAll([demoTask, demoTask2]);
  renderWithProvider(<TasksList />);
  {
    const titleElement = await screen.findByText(demoTask.title);
    const taskCard = titleElement.closest("section")!;
    const checkbox = getByRole(taskCard, "checkbox");
    expect(checkbox).toBeChecked();
  }
  {
    const titleElement = await screen.findByText(demoTask2.title);
    const taskCard = titleElement.closest("section")!;
    const checkbox = getByRole(taskCard, "checkbox");
    expect(checkbox).not.toBeChecked();
  }
});

test("checkbox checks & unchecks a task", async () => {
  boundActions.setAll([demoTask]);
  renderWithProvider(<TasksList />);
  {
    const titleElement = await screen.findByText(demoTask.title);
    const taskCard = titleElement.closest("section")!;
    const checkbox = getByRole(taskCard, "checkbox");
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox).not.toBeChecked());

    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox).toBeChecked());
  }
});

test("checkbox checks & uncheck actually interacts with the mock server", async () => {
  boundActions.setAll([demoTask]);
  const getCurrentTaskState = () =>
    selectors.selectById(store.getState(), demoTask.id)!;
  renderWithProvider(<TasksList />);
  {
    const titleElement = await screen.findByText(demoTask.title);
    const taskCard = titleElement.closest("section")!;
    const checkbox = getByRole(taskCard, "checkbox");
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox).not.toBeChecked());
    expect(getCurrentTaskState().done).toBe(false);

    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox).toBeChecked());
    expect(getCurrentTaskState().done).toBe(true);
  }
});

test("delete button removes", async () => {
  boundActions.setAll([demoTask]);
  renderWithProvider(<TasksList />);
  {
    const titleElement = await screen.findByText(demoTask.title);
    const taskCard = titleElement.closest("section")!;
    const deleteBtn = getByLabelText(taskCard, /löschen/);

    fireEvent.click(deleteBtn);

    await waitFor(() =>
      expect(() => screen.getByText(demoTask.title)).toThrow()
    );
  }
});
