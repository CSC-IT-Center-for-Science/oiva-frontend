import { getKieliList } from "./kieliUtil";
import { sortOpetuskielet } from "./opetuskieletUtil";
import {
  FETCH_KIELET_START,
  FETCH_KIELET_SUCCESS,
  FETCH_KIELET_FAILURE,
  FETCH_OPPILAITOKSENOPETUSKIELET_START,
  FETCH_OPPILAITOKSENOPETUSKIELET_SUCCESS,
  FETCH_OPPILAITOKSENOPETUSKIELET_FAILURE
} from "./actionTypes";

export default function(state, action) {
  switch (action.type) {
    case FETCH_KIELET_START:
      return {
        ...state,
        isFetching: true,
        fetched: false,
        hasErrored: false
      };
    case FETCH_KIELET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetched: true,
        hasErrored: false,
        data: {
          kielet: getKieliList(action.payload, "FI"),
          kieletRaw: action.payload
        }
      };
    case FETCH_KIELET_FAILURE:
      return {
        ...state,
        isFetching: false,
        fetched: false,
        hasErrored: true
      };
    case FETCH_OPPILAITOKSENOPETUSKIELET_START:
      return {
        ...state,
        isFetching: true,
        fetched: false,
        hasErrored: false
      };
    case FETCH_OPPILAITOKSENOPETUSKIELET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetched: true,
        hasErrored: false,
        data: {
          opetuskielet: sortOpetuskielet(action.payload)
        }
      };
    case FETCH_OPPILAITOKSENOPETUSKIELET_FAILURE:
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
