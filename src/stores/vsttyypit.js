import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const Store = createStore({
  initialState: [],
  actions: {
    load: () => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "vsttyypit"
        }
      );
    }
  },
  name: "vsttyypit"
});

export const useVSTTyypit = createHook(Store);
