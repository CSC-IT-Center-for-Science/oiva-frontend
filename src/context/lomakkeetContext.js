import React, { useReducer } from "react";
import reducer from "../services/lomakkeet/reducer";

const initialState = {
  perustelut: {
    tutkinnot: {
      addition: []
    },
    koulutukset: {}
  }
};

const LomakkeetContext = React.createContext(initialState);

const LomakkeetProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <LomakkeetContext.Provider value={{ state, dispatch }}>
      {props.children}
    </LomakkeetContext.Provider>
  );
};

export { LomakkeetContext, LomakkeetProvider };
