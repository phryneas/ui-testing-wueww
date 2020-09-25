/// <reference types="cypress" />

import { css } from "cypress/types/jquery";

describe("Add a Task", () => {
  beforeEach(() => {
    cy.server();
    cy.route("POST", "http://localhost:5000/graphql").as("graphql");
  });

  it("Vistit the page", () => {
    cy.visit("http://localhost:3000");
  });

  it("Fill input fields", () => {
    cy.get("#newTask-title")
      .type("Write tests with cypress")
      .should("have.value", "Write tests with cypress");

    cy.get("#newTask-description")
      .type("For Integration Testing")
      .should("have.value", "For Integration Testing");
  });

  it("Press 'Hinzufügen'", () => {
    cy.get(".MuiGrid-root > .MuiButtonBase-root").click();

    cy.wait("@graphql");

    cy.get(":nth-child(2) > .MuiGrid-container")
      .children()
      .should("have.length.at.least", 1);
  });
});
