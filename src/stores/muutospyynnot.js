import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";
import ProcedureHandler from "../components/02-organisms/procedureHandler";

const Store = createStore({
  initialState: {},
  actions: {
    esittelyyn: (uuid, formatMessage) => () => {
      return new ProcedureHandler(
        formatMessage
      ).run("muutospyynnot.tilanmuutos.esittelyyn", [uuid]);
    },
    load: (oid, isForceReloadRequested) => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "muutospyynnot",
          urlEnding: oid
        },
        { oid },
        isForceReloadRequested ? 0 : undefined
      );
    },
    loadByStates: (
      tilat = [],
      path,
      vainOmat = false,
      isForceReloadRequested,
      koulutustyyppi
    ) => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "muutospyynnot",
          urlEnding: `?tilat=${tilat.map(tila =>
            tila.toUpperCase()
          )}&vainOmat=${vainOmat}${koulutustyyppi ? "&koulutustyyppi=" + koulutustyyppi : ""}`,
          path
        },
        {koulutustyyppi},
        isForceReloadRequested ? 0 : undefined
      );
    },
    remove: (uuid, formatMessage) => () => {
      return new ProcedureHandler(
        formatMessage
      ).run("muutospyynnot.poisto.poista", [uuid]);
    }
  },
  name: "Muutospyynnöt"
});

export const useMuutospyynnot = createHook(Store);
