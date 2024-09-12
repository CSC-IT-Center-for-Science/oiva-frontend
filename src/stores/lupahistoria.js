import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";

const Store = createStore({
  initialState: {},
  actions: {
    load:
      (jarjestajaOid, koulutusmuoto, oppilaitostyyppi) =>
      ({ getState, setState }) => {
        const params = [];
        if (koulutusmuoto.koulutustyyppi) {
          params.push({
            key: "koulutustyyppi",
            value: koulutusmuoto.koulutustyyppi
          });
        }
        if (oppilaitostyyppi) {
          params.push({ key: "oppilaitostyyppi", value: oppilaitostyyppi });
        }
        return execute(
          { getState, setState },
          {
            key: "lupahistoria",
            urlEnding: jarjestajaOid,
            queryParameters: params
          },
          {
            jarjestajaOid,
            koulutusmuoto,
            oppilaitostyyppi
          }
        );
      }
  },
  name: "Lupahistoria"
});

export const useLupahistoria = createHook(Store);
