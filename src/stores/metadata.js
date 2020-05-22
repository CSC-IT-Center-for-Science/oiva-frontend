import { createStore, createHook } from "react-sweet-state";

const Store = createStore({
  initialState: {
    lomakkeet: {
      latauskerrat: {}
    }
  },
  actions: {
    registerLomakeLoad: lomakeId => ({ getState, setState }) => {
      const state = getState();
      const nextState = {
        ...state,
        lomakkeet: {
          ...state.lomakkeet,
          latauskerrat: {
            ...state.lomakkeet.latauskerrat,
            [lomakeId]: (state.lomakkeet.latauskerrat[lomakeId] || 0) + 1
          }
        }
      };
      setState(nextState);
    }
  },
  name: "Metadata"
});

export const useMetadata = createHook(Store);
