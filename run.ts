import { stages } from ".";
import { StageTransforms, runStage, PreviousState, Transform } from "./stage";

export interface RunConfig {
  /** The name of this specific config, itended to make it easy to figure out what run failed if one does.
      Could probably do with a more sophisticated system to making it clear what failed.
    */
  name: string;
  stageTransforms: StageTransforms;
}

export const execRun = (cy: any, config: RunConfig) => {
  let previousState = {};
  for (const stage of stages) {
    previousState = {
      ...previousState,
      [stage.key]: runStage(
        cy,
        stage,
        previousState as PreviousState<any>,
        config.stageTransforms[stage.key] as unknown as Transform<any>[]
      ),
    };
  }
};
