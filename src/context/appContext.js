import React, { useReducer } from "react";
import reducer from "services/app/reducer";
import { languages } from "../i18n/supportedLanguages";
import * as R from "ramda";

const sessionLocale = sessionStorage.getItem("locale");
const navigatorLocale = navigator.language.split("-")[0];
const currentLocale =
  sessionLocale ||
  (navigatorLocale && R.contains(navigatorLocale, languages)
    ? navigatorLocale
    : "fi");

const initialState = {
  locale: currentLocale
};

const AppContext = React.createContext(initialState);

const AppProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
