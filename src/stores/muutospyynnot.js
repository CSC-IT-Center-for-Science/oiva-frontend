import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";
import ProcedureHandler from "../components/02-organisms/procedureHandler";

const Store = createStore({
  initialState: {},
  actions: {
    esittelyyn: uuid => () => {
      return new ProcedureHandler().run(
        "muutospyynnot.tilanmuutos.esittelyyn",
        [uuid]
      );
    },
    load: (ytunnus, isForceReloadRequested) => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "muutospyynnot",
          urlEnding: ytunnus
        },
        { ytunnus },
        isForceReloadRequested ? 0 : undefined
      );
    },
    loadByStates: (tilat = [], path, vainOmat = false, isForceReloadRequested) => ({
      getState,
      setState
    }) => {
      return execute(
        { getState, setState },
        {
          key: "muutospyynnot",
          urlEnding: `?tilat=${tilat.map(tila =>
            tila.toUpperCase()
          )}&vainOmat=${vainOmat}`,
          path
        },
        {},
        isForceReloadRequested ? 0 : undefined
      );
    },
    remove: uuid => () => {
      return new ProcedureHandler().run("muutospyynnot.poisto.poista", [uuid]);
    }
  },
  name: "Muutospyynnöt"
});

export const useMuutospyynnot = createHook(Store);
