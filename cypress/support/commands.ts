Cypress.Commands.add("login", (email, password, cache = true) => {
  cy.session(
    [email, password],
    async () => {
      await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });
    },
    {
      cacheAcrossSpecs: cache,
    },
  );
});
