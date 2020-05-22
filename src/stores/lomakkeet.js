import { createStore, createHook } from "react-sweet-state";
import { assocPath, equals } from "ramda";

const Store = createStore({
  initialState: {
    kielet: {
      opetuskielet: [],
      tutkintokielet: []
    },
    koulutukset: {
      atvKoulutukset: [],
      kuljettajakoulutukset: [],
      valmentavatKoulutukset: {}
    },
    perustelut: {
      kielet: {
        opetuskielet: [],
        tutkintokielet: []
      },
      koulutukset: {
        atvKoulutukset: [],
        kuljettajakoulutukset: [],
        valmentavatKoulutukset: []
      },
      liitteet: [],
      toimintaalue: {},
      tutkinnot: {}
    },
    taloudelliset: {
      yleisettiedot: [],
      investoinnit: {},
      tilinpaatostiedot: [],
      liitteet: []
    },
    toimintaalue: [],
    opiskelijavuodet: [],
    muut: {},
    tutkinnot: {},
    yhteenveto: {
      yleisettiedot: [],
      hakemuksenLiitteet: []
    }
  },
  actions: {
    set: (_path, lomake) => ({ getState, setState }) => {
      const nextState = assocPath(_path, lomake, getState());
      if (!equals(getState(), nextState)) {
        setState(nextState);
      }
    }
  },
  name: "Lomakkeet"
});

export const useLomakkeet = createHook(Store);
