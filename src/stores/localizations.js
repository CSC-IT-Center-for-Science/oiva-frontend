import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const Store = createStore({
  initialState: [],
  actions: {
    load: lang => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "kaannokset",
          urlEnding: `?lang=${lang}`
        }
      );
    }
  },
  name: "Käännökset"
});

export const useKaannokset = createHook(Store);
