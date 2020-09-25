/// <reference types="cypress" />

describe("Add a Task", () => {
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
    cy.get(":nth-child(1)").contains("Write tests with cypress");
    cy.get(":nth-child(1)").contains("For Integration Testing");
  });
});
