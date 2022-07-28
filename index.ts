import { runStages, StageTransforms } from "./stage";
import { authStage } from "./stages/auth";
import { uploadStage } from "./stages/upload";
import { InputType, withInputType } from "./stages/upload/inputType";
import { Region, withAllRegions, withRegion } from "./stages/upload/region";
import { SrtMode, withSrtMode } from "./stages/upload/srtMode";

export const stages = [authStage, uploadStage] as const;

// TODO: do we want a per-stage config? or should anything customizable be done via transforms?

const enumerable = [
  {
    // creates all permutations of combinations of transforms for each stage
    // for each stage array, it'll take one transform from each sub-array
    auth: [],
    upload: [
      [withRegion(Region.orchestration), withRegion(Region.other)],
      [withInputType(InputType.srt)],
      [withSrtMode(SrtMode.caller), withSrtMode(SrtMode.listener)],
    ],
  },
  {
    auth: [],
    upload: [
      [withRegion(Region.orchestration), withRegion(Region.other)],
      [withInputType(InputType.rtmp)],
    ],
  },
];

const configs: StageTransforms[] = []; // generate from permutations

for (const config of configs) {
  runStages({}, config);
}
