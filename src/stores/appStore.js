import { createStore, createHook } from "react-sweet-state";
import { assoc } from "ramda";

const Store = createStore({
  initialState: {
    isDebugModeOn: process.env.REACT_APP_DEBUG === "true",
    locale: "fi"
  },
  actions: {
    getCurrentLocale: () => ({ getState }) => {
      return getState().locale;
    },
    setLocale: locale => ({ getState, setState }) => {
      setState(assoc("locale", locale, getState()));
    }
  },
  name: "App store - Global settings"
});

export const useGlobalSettings = createHook(Store);
