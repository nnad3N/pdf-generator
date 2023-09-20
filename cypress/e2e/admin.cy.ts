describe("user CRUD", () => {
  beforeEach(() => {
    cy.login("root@root.com", "root", true);
    cy.visit("http://localhost:3000/admin", {
      onBeforeLoad(window) {
        cy.stub(window.console, "error").as("consoleError");
      },
    });
    cy.get('button[data-test="add-new-user"]').as("addNew");
  });
  it("should prevent from deactivating the same user as you are currently logged on", () => {
    cy.contains("root@root.com")
      .parent()
      .children()
      .last()
      .find("button")
      .click();

    cy.get("ul").children().contains("Deactivate").click();

    cy.get("@consoleError").should("be.called");
  });
  //...
});
