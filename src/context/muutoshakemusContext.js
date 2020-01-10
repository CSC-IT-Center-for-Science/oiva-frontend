import React, { useReducer } from "react";
import reducer from "../services/muutoshakemus/reducer";

const initialState = {};

const MuutoshakemusContext = React.createContext(initialState);

const MuutoshakemusProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MuutoshakemusContext.Provider value={{ state, dispatch }}>
      {props.children}
    </MuutoshakemusContext.Provider>
  );
};

export { MuutoshakemusContext, MuutoshakemusProvider };
