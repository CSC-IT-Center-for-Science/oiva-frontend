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
          urlEnding: "avoimet" // avoimet, valmistelussa, paatetyt
        },
        {},
        isForceReloadRequested ? 0 : undefined
      );
    }
  },
  name: "Muutospyynnöt - Esittelijä - Avoimet"
});

export const useMuutospyynnotEsittelijaAvoimet = createHook(Store);
