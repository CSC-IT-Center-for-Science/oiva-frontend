import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const Store = createStore({
  initialState: {},
  actions: {
    load: isForceReloadRequested => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "muutospyynnot",
          urlEnding: "paatetyt" // avoimet, valmistelussa, paatetyt
        },
        {},
        isForceReloadRequested ? 0 : undefined
      );
    }
  },
  name: "Muutospyynnöt - Esittelijä - Päätetty"
});

export const useMuutospyynnotEsittelijaPaatetty = createHook(Store);
