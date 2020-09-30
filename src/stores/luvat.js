import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const refreshIntervalInSeconds = 0;

const Store = createStore({
  initialState: {},
  actions: {
    load: (queryParameters = []) => ({ getState, setState }) => {
      console.info(queryParameters);
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
