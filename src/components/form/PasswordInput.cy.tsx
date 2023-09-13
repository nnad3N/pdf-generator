import React from "react";
import PasswordInput from "./PasswordInput";

describe("<PasswordInput />", () => {
  it("shows and hides password input", () => {
    cy.mount(<PasswordInput label="Password" />);

    cy.get("input").type("test");
    cy.get("input").should("have.attr", "type", "password");

    cy.get("button").click();
    cy.get("input").should("have.attr", "type", "text");

    cy.get("button").click();
    cy.get("input").should("have.attr", "type", "password");

    cy.get("input").should("have.value", "test");
  });
});
