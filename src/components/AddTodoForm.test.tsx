import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { AddTodoForm } from "./AddTodoForm";

it("renders without crashing", () => {
  render(<AddTodoForm />);
});

it("renders with a disabled add button", () => {
  render(<AddTodoForm />);
  const submitButton = screen.getByText("Hinzufügen");
  expect(submitButton).toBeDisabled();
});

it("add button enables once both inputs are filled", () => {
  render(<AddTodoForm />);
  const submitButton = screen.getByText("Hinzufügen");

  const titleInput = screen.getByLabelText("Titel");
  const descriptionInput = screen.getByLabelText("Beschreibung");

  expect(submitButton).toBeDisabled();

  fireEvent.change(titleInput, { target: { value: "TestTitel" } });
  fireEvent.change(descriptionInput, { target: { value: "TestDesc" } });

  expect(submitButton).not.toBeDisabled();
});
