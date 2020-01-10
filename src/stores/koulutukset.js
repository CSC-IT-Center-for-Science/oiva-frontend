import { createStore, createHook } from "react-sweet-state";
import loadFromBackend from "./utils/loadFromBackend";
import { MUUT_KEYS } from "../scenes/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/constants";
import { assocPath, flatten, keys, forEach } from "ramda";

const refreshIntervalInSeconds = 1200;

function executeMultiple({ getState, setState }, config, statePathStr) {
  let abortControllers = [];

  forEach(key => {
    const state = getState();
    if (
      state[statePathStr][key].isLoading !== true &&
      (state[statePathStr][key].isErroneous ||
        !state[statePathStr][key].fetchedAt ||
        new Date().getTime() - state[statePathStr][key].fetchedAt >=
          refreshIntervalInSeconds * 1000)
    ) {
      setState(assocPath([statePathStr, key, "isLoading"], true, state));

      abortControllers.push(
        loadFromBackend({ ...config, urlEnding: key }, (data, isErroneous) => {
          setState(
            assocPath(
              [statePathStr, key],
              {
                data,
                fetchedAt: new Date().getTime(),
                isErroneous,
                isLoading: false
              },
              getState()
            )
          );
        })
      );
    }
  }, keys(getState()[statePathStr]));

  return abortControllers;
}

const Store = createStore({
  initialState: {
    poikkeukset: {
      999901: {},
      999903: {}
    },
    muut: {
      [MUUT_KEYS.AMMATILLISEEN_TEHTAVAAN_VALMISTAVA_KOULUTUS]: {},
      [MUUT_KEYS.OIVA_TYOVOIMAKOULUTUS]: {},
      [MUUT_KEYS.KULJETTAJAKOULUTUS]: {}
    }
  },

  actions: {
    load: () => ({ getState, setState }) => {
      let abortControllers = flatten([
        // Let's fetch 999901 and 999903
        executeMultiple(
          { getState, setState },
          {
            key: "koulutus"
          },
          "poikkeukset"
        ),
        // Let's fetch MUUT KOULUTUKSET
        executeMultiple(
          { getState, setState },
          {
            key: "koulutuksetMuut"
          },
          "muut"
        )
      ]);

      return abortControllers;
    }
  },
  name: "Koulutukset"
});

export const useKoulutukset = createHook(Store);
