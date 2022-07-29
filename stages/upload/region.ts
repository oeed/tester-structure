import { UploadTransform } from "../upload";

export enum Region {
  orchestration,
  other,
}

export const withRegion =
  (region: Region): UploadTransform =>
  async (cy, state, previous) => {
    // 'playwright select region here'

    return {
      state: {
        ...state,
        region,
      },
      assertions: async (cy) => {
        cy.assert.thing();
      },
    };
  };

export const withAllRegions = [
  withRegion(Region.orchestration),
  withRegion(Region.other),
];
