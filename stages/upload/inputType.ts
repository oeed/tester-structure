import { UploadTransform } from "../upload";

export enum InputType {
  rtmp,
  srt,
}

export const withInputType =
  (inputType: InputType): UploadTransform =>
  (cy, state, global) => {
    // 'playwrite select input type here'

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
