import { SET_LOCALE } from "./actionTypes";

export function setLocale(locale) {
  return dispatch => {
    dispatch({ type: SET_LOCALE, locale });
  };
}
