import { type mount } from "cypress/react18";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      login(email: string, password: string, cache?: boolean): Chainable<void>;
    }
  }
}
