import { UploadTransform } from "../upload";

export enum InputType {
  rtmp,
  srt,
}

export const withInputType =
  (inputType: InputType): UploadTransform =>
  async (cy, state, previous) => {
    // 'playwright select input type here'

    cy.select.inputType();

    return {
      state: {
        ...state,
        inputType,
      },
      assertions: async (cy) => {
        cy.assert.thing();
      },
      cleanUp: () => {},
    };
  };
