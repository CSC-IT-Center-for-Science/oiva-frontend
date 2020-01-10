import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const Store = createStore({
  initialState: {},
  actions: {
    load: jarjestajaOid => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "lupahistoria",
          urlEnding: jarjestajaOid
        },
        {
          jarjestajaOid
        }
      );
    }
  },
  name: "Lupahistoria"
});

export const useLupahistoria = createHook(Store);
