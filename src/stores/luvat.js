import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const refreshIntervalInSeconds = 1200;

const Store = createStore({
  initialState: {},
  actions: {
    load: (queryParameters = []) => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "luvat",
          queryParameters
        },
        {},
        refreshIntervalInSeconds
      );
    }
  },
  name: "Luvat"
});

export const useLuvat = createHook(Store);
