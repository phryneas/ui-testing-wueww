/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

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
    cy.get("[data-testid=TaskList]").then((lastListDomState) => {
      const currentTaskCount = lastListDomState.children().length;

      cy.findByText("Hinzufügen").click();
      cy.wait("@graphql");

      cy.get("[data-testid=TaskList]")
        .children()
        .should("have.length", currentTaskCount + 1);
    });
  });
});
