import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const Store = createStore({
  initialState: {},
  actions: {
    load: userOid => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "organisaatio",
          urlEnding: userOid
        },
        { userOid }
      );
    }
  },
  name: "Organisation"
});

export const useOrganisation = createHook(Store);
