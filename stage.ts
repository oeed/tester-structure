import { stages } from ".";

export const runStage = async <S extends Stage<any, any>>(
  cy: any,
  stage: S,
  previousState: PreviousState<S>,
  transforms: Transform<S>[]
): Promise<S> => {
  // pre transform (load the page, etc.)
  let transformState = await stage.preTransform(
    cy,
    stage.initialState,
    previousState as any
  );

  let transformAssertions: TransformAssertions<S>[] = [];
  for (const transform of transforms) {
    let result = await transform(cy, transformState, previousState);
    const { assertions, state } = result;
    transformState = state;
    if (assertions) {
      transformAssertions.push(assertions);
    }
  }

  // post transform (submit, etc.)
  const finalState = await stage.postTransform(
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

interface TranformResult<S extends Stage<any, any>> {
  state: TransformState<S>;
  assertions?: TransformAssertions<S>;
  cleanUp?: (
    cy: any,
    state: TransformState<S>,
    previousState: PreviousState<S>
  ) => void;
}

// Mutate the DOM `cy` and note that transform on the state `S`, returning either the newly reflected state and any assertions that need to be run at the end of this stage.
// Do *not* mutate `state` or `previousState`, instead return any changes to `state` (i.e. like React state).
export type Transform<S extends Stage<any, any>> = (
  cy: any,
  state: TransformState<S>,
  previousState: PreviousState<S>
) => Promise<TranformResult<S>>;

// `Stage` has three different states, although it can use the state type for all three.
// State `A` - before any loading has been done.
// State `B` - after the `preTransform` has run (i.e. page is open). This is the state given to all transforms.
// State `C` - after the all transforms and `postTransform` have run (i.e. page has submitted). This is the state used by later stages.
export interface Stage<K extends string, A, B = A, C = B> {
  key: K;
  initialState: A;

  // Setup this stage ready for any transformations (e.g. load the page, insert common values, etc.)
  preTransform: (
    cy: any,
    state: A,
    // @ts-ignore: complains about recursion occasionally, but it's not actually an issue. this can probably be removed
    previousState: PreviousState<this>
  ) => Promise<B>;

  // Do any final tasks on this page to complete it's job before running assertions (e.g. submit the page)
  postTransform: (
    cy: any,
    state: B,
    previousState: PreviousState<this>
  ) => Promise<C>;

  assertions: (
    cy: any,
    state: C,
    previousState: PreviousState<this>
  ) => Promise<void>;

  // Clean up any common resources created by this stage.
  cleanUp: (
    cy: any,
    state: C,
    previousState: PreviousState<this>
  ) => Promise<void>;
}

/** The transforms to run for the given stages of a run. */
export type StageTransforms = {
  [S in UnionizeTuple<typeof stages> as StageKey<S>]: Transform<S>[];
};

// PreviousState rather exploits TypeScript to a rather large degree to ensure later stages
// only have previous stages' states. It is a tad fragile though as its recursive, so if
// types break it'll be because of this.
export type PreviousState<S extends Stage<string, any>> = UnionizeIntersection<{
  [P in UnionizeTuple<Preceding<S, Stages>> as StageKey<P>]: PreFinalState<P>;
}>;

// Returned by transforms to run custom assertions specific to that transforms
type TransformAssertions<S extends Stage<any, any>> = (
  cy: any,
  state: TransformState<S>,
  previousState: PreviousState<S>
) => Promise<void>;

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

/** Seize the types of production. */
type UnionizeTuple<T extends readonly any[]> = T[number];
type UnionizeIntersection<T> = (
  T extends any ? (_: T) => void : never
) extends (_: infer I) => void
  ? I
  : never;

type PreTransformState<S> = S extends Stage<any, infer A, any, any> ? A : never;
type TransformState<S> = S extends Stage<any, any, infer A, any> ? A : never;
type PreFinalState<S> = S extends Stage<any, any, any, infer A> ? A : never;

type StageKey<S extends Stage<string, any>> = S extends Stage<infer K, any>
  ? K
  : never;
type Stages = typeof stages;
