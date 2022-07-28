import { runStages, StageTransforms } from "./stage";
import { authStage } from "./stages/auth";
import { uploadStage } from "./stages/upload";
import { InputType, withInputType } from "./stages/upload/inputType";
import { Region, withRegion } from "./stages/upload/region";

export const stages = [authStage, uploadStage] as const;

// TODO: do we want a per stage config? or should anything customizable be done via transforms?
// TODO: we can probably generate this automatically
const configs: StageTransforms[] = [
  {
    auth: [],
    upload: [withInputType(InputType.srt), withRegion(Region.orchestration)],
  },
  {
    auth: [],
    upload: [withInputType(InputType.rtmp), withRegion(Region.orchestration)],
  },
  {
    auth: [],
    upload: [withInputType(InputType.rtmp), withRegion(Region.other)],
  },
  {
    auth: [],
    upload: [withInputType(InputType.srt), withRegion(Region.other)],
  },
];

for (const config of configs) {
  runStages({}, config);
}
