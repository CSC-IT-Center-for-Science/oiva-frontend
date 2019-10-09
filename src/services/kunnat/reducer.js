import { getToimialueList } from "../../services/toimialueet/toimialueUtil";
import {
  FETCH_KUNNAT_START,
  FETCH_KUNNAT_SUCCESS,
  FETCH_KUNNAT_FAILURE
} from "./actionTypes";

export default function(state, action) {
  switch (action.type) {
    case FETCH_KUNNAT_START:
      return {
        ...state,
        isFetching: true,
        fetched: false,
        hasErrored: false
      };
    case FETCH_KUNNAT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetched: true,
        hasErrored: false,
        data: action.payload,
        kuntaList: getToimialueList(action.payload, "FI", "kunta")
      };
    case FETCH_KUNNAT_FAILURE:
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
