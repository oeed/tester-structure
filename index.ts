import { authStage } from "./stages/auth";
import { uploadStage } from "./stages/upload";

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
