import { Stage } from "../stage";

interface AuthState {
  userId: number;
}

export const authStage: Stage<{}, {}, AuthState> = {
  key: "auth",
  initialState: {},
  preTransform: (cy, state) => state,
  postTransform: (cy, state) => ({
    userId: 1,
  }),
  assertions: () => {},
};
