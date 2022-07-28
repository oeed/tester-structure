import { UploadTransform } from "../upload";

export enum InputType {
  rtmp,
  srt,
}

export const withInputType =
  (inputType: InputType): UploadTransform =>
  (cy, state, previous) => {
    // 'playwright select input type here'

    cy.select.inputType();

    return [
      {
        ...state,
        inputType,
      },
      (cy) => {
        cy.assert.thing();
      },
    ];
  };
