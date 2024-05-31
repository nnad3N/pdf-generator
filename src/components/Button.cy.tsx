import React from "react";
import Button from "./Button";

describe("<Button />", () => {
  it("should render children", () => {
    cy.mount(<Button>Button</Button>);
    cy.get("button").should("contain.text", "Button");
  });

  it("should render the loading state", () => {
    cy.mount(<Button isLoading={true}>Test</Button>);
    cy.get("button").should("contain.text", "Testing");
    cy.get("button").should("be.disabled");
  });

  it("should render the loading state and parses the text automatically to have -ing when word ends with the letter e", () => {
    cy.mount(<Button isLoading={true}>Update</Button>);
    cy.get("button").should("contain.text", "Updating");
  });

  it("should render the loading text", () => {
    cy.mount(
      <Button isLoading={true} loadingText="Submitting">
        Submit
      </Button>,
    );
    cy.get("button").should("contain.text", "Submitting");
  });

  it("should render the default loading text", () => {
    cy.mount(<Button isLoading={true}></Button>);
    cy.get("button").should("contain.text", "Loading");
  });
});
