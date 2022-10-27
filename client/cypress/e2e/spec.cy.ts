describe("Home page", () => {
  it("successfully loads", () => {
    cy.visit("/");

    cy.contains("a", "Problems");
    cy.contains("a", "Problem Lists");
  });

  it("opens problems page in a new tab", () => {
    cy.visit("/");

    cy.contains("a", "Problems").click();

    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
});
