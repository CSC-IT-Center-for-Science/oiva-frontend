import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const Store = createStore({
  initialState: {},
  actions: {
    load: oid => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "organisaatio",
          path: [oid],
          urlEnding: oid
        },
        { oid }
      );
    }
  },
  name: "Organisation"
});

export const useOrganisation = createHook(Store);
