import { API_BASE_URL } from "../../../modules/constants"

// Constants
export const FETCH_MUUTOSPYYNNOT_START = 'FETCH_MUUTOSPYYNNOT_START'
export const FETCH_MUUTOSPYYNNOT_SUCCESS = 'FETCH_MUUTOSPYYNNOT_SUCCESS'
export const FETCH_MUUTOSPYYNNOT_FAILURE = 'FETCH_MUUTOSPYYNNOT_FAILURE'

// Actions
export function fetchAvoimetAsiat() {
  return (dispatch) => {
    dispatch({ type: FETCH_MUUTOSPYYNNOT_START })

    const request = fetch(`${API_BASE_URL}/muutospyynnot/avoimet/`)

    request
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: FETCH_MUUTOSPYYNNOT_SUCCESS, payload: data })
      })
      .catch((err) => dispatch({ type: FETCH_MUUTOSPYYNNOT_FAILURE, payload: err }))
  }
}

export function fetchValmistelussaAsiat() {
    return (dispatch) => {
        dispatch({ type: FETCH_MUUTOSPYYNNOT_START })

        const request = fetch(`${API_BASE_URL}/muutospyynnot/valmistelussa/`)

        request
            .then((response) => response.json())
            .then((data) => {
                dispatch({ type: FETCH_MUUTOSPYYNNOT_SUCCESS, payload: data })
            })
            .catch((err) => dispatch({ type: FETCH_MUUTOSPYYNNOT_FAILURE, payload: err }))
    }
}

export function fetchPaatetytAsiat() {
    return (dispatch) => {
        dispatch({ type: FETCH_MUUTOSPYYNNOT_START })

        const request = fetch(`${API_BASE_URL}/muutospyynnot/paatetyt/`)

        request
            .then((response) => response.json())
            .then((data) => {
                dispatch({ type: FETCH_MUUTOSPYYNNOT_SUCCESS, payload: data })
            })
            .catch((err) => dispatch({ type: FETCH_MUUTOSPYYNNOT_FAILURE, payload: err }))
    }
}

export const actions = {
    fetchAvoimetAsiat,
    fetchValmistelussaAsiat,
    fetchPaatetytAsiat
}

// Action handlers
const ACTION_HANDLERS = {
  [FETCH_MUUTOSPYYNNOT_START]    : (state, action) => {
    return {
      ...state,
      isFetching: true,
      fetched: false,
      hasErrored: false
    }
  },
  [FETCH_MUUTOSPYYNNOT_SUCCESS]  : (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: true,
      hasErrored: false,
      data: action.payload
    }
  },
  [FETCH_MUUTOSPYYNNOT_FAILURE]  : (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: false,
      hasErrored: true
    }
  }
}

// Reducer
const initialState = {
  isFetching: false,
  fetched: false,
  hasErrored: false,
  data: {}
}

export default function muutospyynnotReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
