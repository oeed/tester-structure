import { Stage, Transform } from "../stage";
import { InputType } from "./upload/inputType";

export type UploadTransform = Transform<typeof uploadStage>;

enum Region {
  orchestration,
  other,
}

interface UploadState {
  inputType: InputType;
  region: Region;
}

export const uploadStage: Stage<"upload", {}, UploadState> = {
  key: "upload",
  initialState: {},
  preTransform: (cy, state, prev) => ({
    inputType: InputType.rtmp,
    region: Region.orchestration,
  }),
  postTransform: (cy, state) => state,
  assertions: () => {},
};
