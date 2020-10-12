import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { screen, fireEvent, waitFor, getByText } from "@testing-library/dom";
import App from "./App";
import { act } from "react-dom/test-utils";
import { setupTests } from "../mocks/setupTests";

const { renderWithProvider, boundActions } = setupTests();

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
