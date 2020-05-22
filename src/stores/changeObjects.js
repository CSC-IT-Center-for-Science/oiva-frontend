import { createStore, createHook } from "react-sweet-state";
import { assocPath, filter, path, split } from "ramda";
import { getAnchorPart } from "../utils/common";

const initialState = {
  tutkinnot: {},
  kielet: {
    opetuskielet: [],
    tutkintokielet: {}
  },
  koulutukset: {
    atvKoulutukset: [],
    kuljettajakoulutukset: [],
    valmentavatKoulutukset: []
  },
  perustelut: {
    kielet: {
      opetuskielet: [],
      tutkintokielet: []
    },
    koulutukset: {
      atvKoulutukset: [],
      kuljettajakoulutukset: [],
      tyovoimakoulutukset: [],
      valmentavatKoulutukset: []
    },
    opiskelijavuodet: {
      sisaoppilaitos: [],
      vaativatuki: [],
      vahimmaisopiskelijavuodet: []
    },
    liitteet: [],
    toimintaalue: [],
    tutkinnot: {}
  },
  taloudelliset: {
    yleisettiedot: [],
    investoinnit: [],
    tilinpaatostiedot: [],
    liitteet: []
  },
  muut: {},
  opiskelijavuodet: [],
  toimintaalue: [],
  yhteenveto: {
    yleisettiedot: [],
    hakemuksenLiitteet: []
  },
  // Top three fields of muutospyyntö form of esittelijä role
  topthree: []
};

const Store = createStore({
  initialState,
  actions: {
    initialize: changeObjects => ({ setState }) => {
      setState(changeObjects);
    },
    removeByAnchor: anchor => ({ getState, setState }) => {
      const currentState = getState();
      const pathOfChangeObj = split("_", getAnchorPart(anchor, 0));
      const changeObjectsLeft = filter(changeObj => {
        return changeObj.anchor !== anchor;
      }, path(pathOfChangeObj, currentState));
      setState(assocPath(pathOfChangeObj, changeObjectsLeft, currentState));
    },
    reset: () => ({ setState }) => {
      setState(initialState);
    },
    set: (id, changeObjects) => ({ getState, setState }) => {
      setState(assocPath(split("_", id), changeObjects, getState()));
    }
  },
  name: "Change objects"
});

export const useChangeObjects = createHook(Store);
