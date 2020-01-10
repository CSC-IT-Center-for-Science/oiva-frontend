import { SET_LOCALE } from "./actionTypes";

export default function(state, action) {
  switch (action.type) {
    case SET_LOCALE:
      return {
        ...state,
        locale: action.locale
      };
    default:
      return state;
  }
}
