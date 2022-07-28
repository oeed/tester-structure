import { UploadTransform } from "../upload";

export enum Region {
  orchestration,
  other,
}

export const withRegion =
  (region: Region): UploadTransform =>
  (cy, state, previous) => {
    // 'playwright select region here'

    return [
      {
        ...state,
        region,
      },
      (cy) => {
        cy.assert.thing();
      },
    ];
  };
