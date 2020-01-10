import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const refreshIntervalInSeconds = 60;

const Store = createStore({
  initialState: {},
  actions: {
    load: uuid => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "muutospyynnonLiitteet",
          urlEnding: uuid
        },
        { uuid },
        refreshIntervalInSeconds
      );
    }
  },
  name: "Muutospyynnön liitteet"
});

export const useMuutospyynnonLiitteet = createHook(Store);
