import { Stage, Transform } from "../stage";

export type AuthTransform = Transform<typeof authStage>;

interface AuthState {
  userId: number;
}

export const authStage: Stage<"auth", {}, {}, AuthState> = {
  key: "auth",
  initialState: {},
  preTransform: (cy, state) => state,
  postTransform: (cy, state) => ({
    userId: 1,
  }),
  assertions: () => {},
};
