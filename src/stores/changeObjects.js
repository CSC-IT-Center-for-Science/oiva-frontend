import { createStore, createHook } from "react-sweet-state";
import { assocPath, filter, path, split } from "ramda";
import { getAnchorPart } from "../utils/common";

const Store = createStore({
  initialState: {
    kielet: {
      opetuskielet: [],
      tutkintokielet: []
    },
    koulutukset: {
      atvKoulutukset: [],
      valmentavatKoulutukset: []
    },
    perustelut: {
      kielet: {
        opetuskielet: [],
        tutkintokielet: []
      },
      koulutukset: {
        atvKoulutukset: [],
        kuljettajakoulutukset: {},
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
    yhteenveto: {
      yleisettiedot: [],
      hakemuksenliitteet: []
    }
  },
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
    set: (id, changeObjects) => ({ getState, setState }) => {
      setState(assocPath(split("_", id), changeObjects, getState()));
    }
  },
  name: "Change objects"
});

export const useChangeObjects = createHook(Store);
