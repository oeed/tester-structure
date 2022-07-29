import { AuthTransform } from "../auth";

// Transforms don't have to be created through a function call, that's only needed if they have parameters.
// This transform always just does one thing.
export const withResetPassword: AuthTransform = async (cy, state, previous) => {
  cy.button("Rest Passord").click();
  // etc...

  return {
    state,
    assertions: async (cy) => {
      cy.assert.thing();
    },
  };
};
