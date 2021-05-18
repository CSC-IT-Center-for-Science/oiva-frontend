import { API_BASE_URL } from "../constants";

// Constants
export const FETCH_KOHTEET_START = "FETCH_KOHTEET_START";
export const FETCH_KOHTEET_SUCCESS = "FETCH_KOHTEET_SUCCESS";
export const FETCH_KOHTEET_FAILURE = "FETCH_KOHTEET_FAILURE";

// Actions
export function fetchKohteet() {
  return dispatch => {
    dispatch({ type: FETCH_KOHTEET_START });

    const request = fetch(`${API_BASE_URL}/kohteet`);

    request
      .then(response => response.json())
      .then(data => {
        dispatch({ type: FETCH_KOHTEET_SUCCESS, payload: data });
      })
      .catch(err => {
        dispatch({ type: FETCH_KOHTEET_FAILURE, payload: err });
      });
  };
}

export const actions = {
  fetchKohteet
};

// Action handlers
const ACTION_HANDLERS = {
  [FETCH_KOHTEET_START]: (state, action) => {
    return {
      ...state,
      isFetching: true,
      fetched: false,
      hasErrored: false
    };
  },
  [FETCH_KOHTEET_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: true,
      hasErrored: false,
      data: action.payload
    };
  },
  [FETCH_KOHTEET_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: false,
      hasErrored: true
    };
  }
};

// Reducer
const initialState = {
  isFetching: false,
  fetched: false,
  hasErrored: false,
  data: []
};

export default function kohdeReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
