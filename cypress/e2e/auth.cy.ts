describe("login screen", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("displays errors on submit with empty form values", () => {
    cy.get('button[type="submit"]').click();
    cy.get('[data-test="input-error-email"]').should("exist");
    cy.get('[data-test="input-error-password"]').should("exist");
  });

  it("displays wrong password error", () => {
    cy.get('input[name="email"]').type("root@root.com");
    cy.get('input[name="password"]').type("wrong password");
    cy.get('button[type="submit"]').click();
    cy.get('[data-test="input-error-password"]').should("exist");
  });

  it("displays invalid user error", () => {
    cy.get('input[name="email"]').type("invalid@root.com");
    cy.get('input[name="password"]').type("root");
    cy.get('button[type="submit"]').click();
    cy.get('[data-test="login-form-error"]').should("exist");
  });

  it("logs in with root user and logs out", () => {
    cy.get('input[name="email"]').type("root@root.com");
    cy.get('input[name="password"]').type("root");
    cy.get('button[type="submit"]').click();
    cy.get("nav").should("exist");
    cy.get('[data-test="logout-button"]').click(),
      cy.get("nav").should("not.exist");
  });
});
