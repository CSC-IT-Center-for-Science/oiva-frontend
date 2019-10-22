import {
  FETCH_FROM_BACKEND_FAILED,
  FETCH_FROM_BACKEND_IS_ON,
  FETCH_FROM_BACKEND_SUCCESS
} from "./actionTypes";
import * as R from "ramda";

function getNextState(key, subKey, data, state) {
  const path = [key, subKey].filter(Boolean);
  return R.assocPath(path, data, state);
}

export default function(state, action) {
  switch (action.type) {
    case FETCH_FROM_BACKEND_FAILED:
      return getNextState(
        action.key,
        action.subKey,
        {
          status: "erroneous"
        },
        state
      );
    case FETCH_FROM_BACKEND_IS_ON:
      return getNextState(
        action.key,
        action.subKey,
        {
          status: "fetching"
        },
        state
      );
    case FETCH_FROM_BACKEND_SUCCESS:
      const nextState = getNextState(
        action.key,
        action.subKey,
        {
          raw: action.data,
          status: "ready",
          fetched: new Date().toUTCString()
        },
        state
      );
      console.info(nextState);
      return nextState;
    default:
      return state;
  }
}
