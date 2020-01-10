import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const Store = createStore({
  initialState: {},
  actions: {
    load: ytunnus => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "lupa",
          urlEnding: `${ytunnus}?with=all`
        },
        { ytunnus }
      );
    }
  },
  name: "Lupa"
});

export const useLupa = createHook(Store);
