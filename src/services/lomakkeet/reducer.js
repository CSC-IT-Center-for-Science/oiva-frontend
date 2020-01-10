import { UPDATE_FORM_STRUCTURE } from "./actionTypes";
import * as R from "ramda";

export default function(state, action) {
  switch (action.type) {
    case UPDATE_FORM_STRUCTURE:
      return R.assocPath(action.formPath, action.newStructure, state);
    default:
      return state;
  }
}
