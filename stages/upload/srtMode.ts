import { UploadTransform } from "../upload";

export enum SrtMode {
  caller,
  listener,
}

export const withSrtMode =
  (srtMode: SrtMode): UploadTransform =>
  async (cy, state, previous) => {
    // 'playwright select input type here'

    cy.select.inputType();

    return {
      state: {
        ...state,
        srtMode,
      },
      assertions: async (cy) => {
        cy.assert.thing();
      },
    };
  };
