import { stage, Stage, Transform } from "../stage";

type UploadTransform = Transform<typeof uploadStage>;

enum InputType {
  rtmp,
  srt,
}

enum Region {
  orchestration,
  other,
}

interface UploadState {
  inputType: InputType;
  region: Region;
}

export const uploadStage = stage<{}, UploadState>({
  key: "upload",
  initialState: {},
  preTransform: (cy, state, prev) => ({
    inputType: InputType.rtmp,
    region: Region.orchestration,
  }),
  postTransform: (cy, state) => state,
  assertions: () => {},
} as const);
