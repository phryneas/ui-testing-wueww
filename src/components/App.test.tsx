import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import {
  screen,
  getByRole,
  fireEvent,
  waitFor,
  getByLabelText,
  getByText,
} from "@testing-library/dom";
import App from "./App";
import { mockServer } from "../mocks/mockServer";
import { Provider, createClient } from "urql";
import { act } from "react-dom/test-utils";

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

test("renders a list", async () => {
  boundActions.setAll([demoTask, demoTask2]);
  renderWithProvider(<App />);
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
  renderWithProvider(<App />);
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
  renderWithProvider(<App />);
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
  renderWithProvider(<App />);
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

test("adding a new task", async () => {
  boundActions.setAll([]);
  renderWithProvider(<App />);

  const titelInput = await screen.findByLabelText(/Titel/);
  const descriptionInput = screen.getByLabelText(/Beschreibung/);
  const submitButton = screen.getByText(/Hinzufügen/);
  act(() => {
    fireEvent.change(titelInput, { target: { value: "TestTitel" } });
    fireEvent.change(descriptionInput, {
      target: { value: "TestBeschreibung" },
    });
  });

  // validation happened
  await waitFor(() => expect(submitButton).not.toBeDisabled());
  fireEvent.submit(descriptionInput);

  // form clears
  await waitFor(() => {
    expect(titelInput).toHaveValue("");
    expect(descriptionInput).toHaveValue("");
  });

  // task in DOM
  const titleElement = await screen.findByText(/TestTitel/);
  const taskCard = titleElement.closest("section")!;
  getByText(taskCard, "TestBeschreibung");
});
