import { AuthTransform } from "../auth";

// Transforms don't have to be created through a function call, that's only needed if they have parameters.
// This transform always just does one thing.
export const withResetPassword: AuthTransform = (cy, state, previous) => {
  cy.button("Rest Passord").click();
  // etc...

  return [
    state,
    (cy) => {
      cy.assert.thing();
    },
  ];
};
