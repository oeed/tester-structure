import { Stage, Transform } from "../stage";
import { InputType } from "./upload/inputType";
import { Region } from "./upload/region";
import { SrtMode } from "./upload/srtMode";

export type UploadTransform = Transform<typeof uploadStage>;

interface IntermediateUploadState {
  inputType: InputType;
  region: Region;
  srtMode?: SrtMode;
}

interface UploadState extends IntermediateUploadState {
  eventId: string;
}

export const uploadStage: Stage<
  "upload",
  {},
  IntermediateUploadState,
  UploadState
> = {
  key: "upload",
  initialState: {},
  preTransform: (cy, state, prev) => {
    cy.openPage("/upload");
    return {
      // the default selected options
      inputType: InputType.rtmp,
      region: Region.orchestration,
    };
  },
  postTransform: (cy, state) => {
    return {
      ...state,
      eventId: cy.read("eventId"),
    };
  },
  assertions: () => {
    // assert that the upload was successful
    // e.g. expect(cy.findText("Event created successfully!"))
  },
};
