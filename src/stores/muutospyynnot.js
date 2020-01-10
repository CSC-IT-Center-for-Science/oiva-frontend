import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const Store = createStore({
  initialState: {},
  actions: {
    load: ytunnus => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "muutospyynnot",
          urlEnding: ytunnus
        },
        { ytunnus }
      );
    }
  },
  name: "Muutospyynnöt"
});

export const useMuutospyynnot = createHook(Store);
