import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const Store = createStore({
  initialState: {},
  actions: {
    load: uuid => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "muutospyynto",
          urlEnding: uuid
        },
        { uuid }
      );
    }
  },
  name: "Muutospyyntö"
});

export const useMuutospyynto = createHook(Store);
