import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const refreshIntervalInSeconds = 1200;

const Store = createStore({
  initialState: {},
  actions: {
    load: () => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "luvat"
        },
        {},
        refreshIntervalInSeconds
      );
    }
  },
  name: "Luvat"
});

export const useLuvat = createHook(Store);
