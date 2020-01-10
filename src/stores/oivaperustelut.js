import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const Store = createStore({
  initialState: {},
  actions: {
    load: () => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "oivaperustelut"
        }
      );
    }
  },
  name: "Oiva - perustelut"
});

export const useOivaperustelut = createHook(Store);
