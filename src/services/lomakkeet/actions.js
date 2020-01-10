import { UPDATE_FORM_STRUCTURE } from "./actionTypes";

export const updateFormStructure = (formPath, newStructure) => {
  return dispatch => {
    dispatch({
      type: UPDATE_FORM_STRUCTURE,
      formPath,
      newStructure
    });
  };
};
