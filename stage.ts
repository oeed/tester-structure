import { stages } from ".";
import { uploadStage } from "./stages/upload";

const runStages = () => {
  let previousState = {};
  for (const stage of stages) {
    previousState = { ...previousState };
  }
};

const runStage = <S extends Stage<any>>(
  cy: any,
  stage: S,
  previousState: PreviousState<S>,
  transforms: Transform<S>[]
): S => {
  // pre transform (load the page, etc.)
  let transformState = stage.preTransform(
    cy,
    stage.initialState,
    previousState as any
  );

  let transformAssertions: TransformAssertions<S>[] = [];
  for (const transform of transforms) {
    let result = transform(cy, transformState, previousState);
    if (Array.isArray(result)) {
      const [resultState, assertions] = result;
      transformState = resultState;
      transformAssertions.push(assertions);
    } else {
      transformState = result;
    }
  }

  // post transform (submit, etc.)
  const finalState = stage.postTransform(
    cy,
    transformState,
    previousState as any
  );

  // assert the state of this page, first the stage's assertions then any transform assertions
  for (const assertions of transformAssertions) {
    assertions(cy, finalState, previousState);
  }

  return finalState;
};

export const stage = <A, B = A, C = B>(stage: Stage<A, B, C>) => stage;

// Mutate the DOM `cy` and note that transform on the state `S`, returning either the newly reflected state or state and any assertions that need to be run at the end of this stage.
// Do *not* mutate `state` or `previousState`, instead return any changes to `state` (i.e. like React state).
export type Transform<S extends Stage<any>> = (
  cy: any,
  state: TransformState<S>,
  previousState: PreviousState<S>
) => [TransformState<S>, TransformAssertions<S>] | TransformState<S>;

/** Get the tuple `T` with the last element removed. */
type Pop<T> = T extends readonly [...infer A, any] ? A : never;

/** Get the last element of tuple `T`. */
type Last<T> = T extends readonly [...any, infer A] ? A : never;

/** Get tuple elements on `T` that preceed `V` */
type Preceding<V, T> = Last<T> extends never
  ? never
  : Last<T> extends V
  ? Pop<T>
  : Preceding<V, Pop<T>>;

/** Size the types of production. */
type UnionizeTuple<T extends any[]> = T[number];
type UnionizeIntersection<T> = (
  T extends any ? (_: T) => void : never
) extends (_: infer I) => void
  ? I
  : never;

type PreTransformState<S> = S extends Stage<infer A, any, any> ? A : never;
type TransformState<S> = S extends Stage<any, infer A, any> ? A : never;
type PreFinalState<S> = S extends Stage<any, any, infer A> ? A : never;

type StageKey<S> = S extends Stage<any> ? S["key"] : never;

type PreviousState<S extends Stage<any>> = UnionizeIntersection<
  PreFinalState<UnionizeTuple<Preceding<S, typeof stages>>>
>;

type A = PreviousState<typeof uploadStage>;
type B = StageKey<typeof uploadStage>;
type C = typeof uploadStage["key"];

// type PreviousState<ST extends Stage<any>> = UnionizeIntersection<{
//   [K in StageKey<Preceding<ST, typeof stages>>]: PreFinalState<
//     UnionizeTuple<Preceding<ST, typeof stages>>
//   >;
// }>;

// Returned by transforms to run custom assertions specific to that transforms
type TransformAssertions<S extends Stage<any>> = (
  cy: any,
  state: TransformState<S>,
  previousState: PreviousState<S>
) => void;

// `Stage` has three different states, although it can use the state type for all three.
// State `A` - before any loading has been done.
// State `B` - after the `preTransform` has run (i.e. page is open). This is the state given to all transforms.
// State `C` - after the all transforms and `postTransform` have run (i.e. page has submitted). This is the state used by later stages.
export interface Stage<A, B = A, C = B> {
  key: string;
  initialState: A;

  // Setup this stage ready for any transformations (e.g. load the page, insert common values, etc.)
  preTransform: (
    cy: any,
    state: A,
    previousState: PreviousState<typeof this>
  ) => B;

  // Do any final tasks on this page to complete it's job before running assertions (e.g. submit the page)
  postTransform: (
    cy: any,
    state: B,
    previousState: PreviousState<typeof this>
  ) => C;

  assertions: (
    cy: any,
    state: C,
    previousState: PreviousState<typeof this>
  ) => void;
}