import { getToimialueList } from "../../services/toimialueet/toimialueUtil";

import {
  FETCH_MAAKUNNAT_START,
  FETCH_MAAKUNNAT_SUCCESS,
  FETCH_MAAKUNNAT_FAILURE
} from "./actionTypes";

export default function(state, action) {
  switch (action.type) {
    case FETCH_MAAKUNNAT_START:
      return {
        ...state,
        isFetching: true,
        fetched: false,
        hasErrored: false
      };
    case FETCH_MAAKUNNAT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetched: true,
        hasErrored: false,
        data: action.payload,
        maakuntaList: getToimialueList(action.payload, "FI", "maakunta")
      };
    case FETCH_MAAKUNNAT_FAILURE:
      return {
        ...state,
        isFetching: false,
        fetched: false,
        hasErrored: true
      };
    default:
      return state;
  }
}
