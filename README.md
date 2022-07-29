# Integration Test Structure

The aim of this structure is to modularise all of the sections of tests in a way that we can create easily create any combination of user flow we want without a confusing web of code. It is intended to isolate concerns and optional steps.

There structure is has 3 main concepts:
- a 'run' (a single specific set of options; a single event)
- a 'stage' (clearly defined steps common to all runs, e.g. login, upload, create output, etc.)
- a 'transform' (a function that performs optional/customisable changes to a specific stage, e.g. 'select SRT')

> NOTE: I've used `cy` as the representation for however we interact with the DOM, whether that be Cypress or otherwise. All example usage of it is pseudo code.

## Runs
The work required for the runs is simply creating all the possible permutations of different options we want. The stage/transform system is designed to make this really simple and flexible to create, so it should simply be a matter of making an algorithm that builds all compatible configurations. I've proposed an array structure to do this, but how these are formed is the part I haven't invested as much time in.

## Stages
Stages `Stage<K, A, B, C>` should largely map to each high level goal like we whiteboarded. The general idea of a stage is that we perform all the customisable actions for the high level goal and then share that state (e.g. event IDs, etc.) with subsequent stages. Stages don't interact with each other, beyond returning a final state later stages can be used.

Each stage has a state (think: React state) with three different steps:
- intial (when the stage first starts, either an empty struct or with the default selections) - maps to `A` in `Stage<K, A, B, C>` 
- transform (the state returned from `preTransform()` and changed by any transforms, should generally be the chose input selections before submitting) - maps to `B` in `Stage<K, A, B, C>` 
- final (the state returned from `postTransform()` and provided to all later stages, should contain values only known after submit, e.g. event ID) - maps to `C` in `Stage<K, A, B, C>` 

Stages have access to all the state of the previously run stages (e.g. upload as access to the auth stage with the user's ID, output schedule has access to auth and upload stages with event ID); this is enforced by TypeScript automatically based on the `stages` array ordering. This previous state is the 'final' state described above returned from `postTransform()`.

Stage's have a key (`K` in `Stage<K, A, B, C>` ), used as the key of the stage in the previous state (i.e. `prev.upload`).

Stage's then have a function `assertions` that asserts anything that is needed to ensure that the stage was successful.

All stages are mandatory and always in the same order. If we want any stages optional move that optional logic to a transform and use 0 transforms when skipping is desired.

## Transforms
To customise what each stage does transform functions are run after the initial page load (`preTransform()`) and do things like select inputs given their paramters. For example, on transform on `upload` picks either SRT or RTMP. Transforms return a modified state (again, think React `setState`).

Transforms should:
- interact with the page, setting any inputs, etc. that are unique to this transform (common interactions should be done in the stage)
- return changes to the state (i.e. if selecting SRT, return a new state that contains `inputType: srt`)
- return any assertions that need to be done specific to this transform

Transforms can be created through a function like `withInputType(inputType)` if they have parameters, or just be a transform on their own like `withResetPassword` when they don't need parameters.

Transforms should not perform any other side-effects beyond manipulating the DOM, i.e. don't directly set values on the state/previous state - only return any state changes.