describe("login screen", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get('input[name="email"]').as("emailInput");
    cy.get('input[name="password"]').as("passwordInput");
    cy.get('button[type="submit"]').as("submitButton");
  });

  it("should display errors on submit with empty form values", () => {
    cy.get("@submitButton").click();
    cy.get('[data-test="input-error-email"]').should("exist");
    cy.get('[data-test="input-error-password"]').should("exist");
  });

  it("should display invalid user error", () => {
    cy.get("@emailInput").type("invalid@root.com");
    cy.get("@passwordInput").type("root");
    cy.get("@submitButton").click();
    cy.get('[data-test="input-error-email"]').should("exist");
  });

  it("should display wrong password error", () => {
    cy.get("@emailInput").type("root@root.com");
    cy.get("@passwordInput").type("wrong-password");
    cy.get("@submitButton").click();
    cy.get('[data-test="input-error-password"]').should("exist");
  });

  it("should log in with root user and then log out", () => {
    cy.get("@emailInput").type("root@root.com");
    cy.get("@passwordInput").type("root");
    cy.get("@submitButton").click();
    cy.get("nav").should("exist");
    cy.get('[data-test="logout-button"]').click();
    cy.get("nav").should("not.exist");
  });

  it("shouldn't allow to login with deactivated user", () => {
    cy.get("@emailInput").type("deactivated@deactivated.com");
    cy.get("@passwordInput").type("deactivated");
    cy.get("@submitButton").click();
    cy.get('[data-test="login-form-error"]').should("exist");
  });
});
