import { execRun, RunConfig } from "./run";
import { StageTransforms } from "./stage";
import { authStage } from "./stages/auth";
import { withResetPassword } from "./stages/auth/resetPassword";
import { uploadStage } from "./stages/upload";
import { InputType, withInputType } from "./stages/upload/inputType";
import { Region, withAllRegions, withRegion } from "./stages/upload/region";
import { SrtMode, withSrtMode } from "./stages/upload/srtMode";

export const stages = [authStage, uploadStage] as const;

// TODO: do we want a per-stage config (i.e. settings that apply regardles of transforms)? or should anything customizable be done via transforms?

const enumerable = [
  {
    // TODO: a func. that creates all permutations of combinations of transforms for each stage
    // for each stage array, it'll take one transform from each sub-array
    auth: [],
    upload: [
      [withRegion(Region.orchestration), withRegion(Region.other)],
      [withInputType(InputType.srt)],
      [withSrtMode(SrtMode.caller), withSrtMode(SrtMode.listener)],
    ],
  },
  {
    auth: [[withResetPassword]],
    upload: [
      [withRegion(Region.orchestration), withRegion(Region.other)],
      [withInputType(InputType.rtmp)],
    ],
  },
];

const configs: RunConfig[] = []; // generate from permutations of the above

for (const config of configs) {
  execRun({}, config);
}
