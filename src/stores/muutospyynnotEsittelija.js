import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const Store = createStore({
  initialState: {},
  actions: {
    load: statusKey => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "muutospyynnot",
          urlEnding: statusKey //avoimet, valmistelussa, paatetyt
        }
      );
    }
  },
  name: "Muutospyynnöt - Esittelijä"
});

export const useMuutospyynnotEsittelija = createHook(Store);
