import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const Store = createStore({
  initialState: {},
  actions: {
    load: (jarjestajaOid, koulutusmuoto) => ({ getState, setState }) => {
      const params = [];
      if (koulutusmuoto.koulutustyyppi) {
        params.push({key: "koulutustyyppi", value: koulutusmuoto.koulutustyyppi})
      }
      return execute(
        { getState, setState },
        {
          key: "lupahistoria",
          urlEnding: jarjestajaOid,
          queryParameters: params
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
