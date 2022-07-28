import { UploadTransform } from "../upload";

export enum SrtMode {
  caller,
  listener,
}

export const withSrtMode =
  (srtMode: SrtMode): UploadTransform =>
  (cy, state, previous) => {
    // 'playwright select input type here'

    cy.select.inputType();

    return [
      {
        ...state,
        srtMode,
      },
      (cy) => {
        cy.assert.thing();
      },
    ];
  };
