import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const Store = createStore({
  initialState: {},
  actions: {
    load: () => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "kayttaja",
          options: { withCredentials: true }
        }
      );
    }
  },
  name: "User"
});

export const useUser = createHook(Store);
