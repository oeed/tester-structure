import { authStage } from "./stages/auth";
import { uploadStage } from "./stages/upload";

// const withInputType =
//   (inputType: InputType): UploadTransform =>
//   (state, global) => {
//     // 'playwrite select input type here'

//     return [
//       {
//         ...state,
//         inputType,
//       },
//       (cy) => {
//         cy.assert.thing();
//       },
//     ];
//   };

// const withRegion =
//   (region: Region): UploadTransform =>
//   (state, global) => {
//     // 'playwrite select region here'

//     return {
//       ...state,
//       region,
//     };
//   };

export const stages = [authStage, uploadStage] as const;
