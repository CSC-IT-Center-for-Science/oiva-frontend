import { API_BASE_URL } from "../constants"

// Constants
export const FETCH_KOULUTUSTYYPIT_START = 'FETCH_KOULUTUSTYYPIT_START'
export const FETCH_KOULUTUSTYYPIT_SUCCESS = 'FETCH_KOULUTUSTYYPIT_SUCCESS'
export const FETCH_KOULUTUSTYYPIT_FAILURE = 'FETCH_KOULUTUSTYYPIT_FAILURE'

// Actions
export function fetchKoulutustyypit() {
  return (dispatch) => {
    dispatch({ type: FETCH_KOULUTUSTYYPIT_START })

    const request = fetch(`${API_BASE_URL}/koodistot/koulutustyypit/`)

    return request
      .then(response => response.json())
      .then(data => {
        dispatch({ type: FETCH_KOULUTUSTYYPIT_SUCCESS, payload: data })
      })
      .catch(err => dispatch({ type: FETCH_KOULUTUSTYYPIT_FAILURE, payload: err }))
  }
}

export const actions = {
  fetchKoulutustyypit
}

// Action handlers
const ACTION_HANDLERS = {
  [FETCH_KOULUTUSTYYPIT_START] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      fetched: false,
      hasErrorer: false
    }
  },
  [FETCH_KOULUTUSTYYPIT_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: true,
      hasErrored: false,
      data: action.payload
    }
  },
  [FETCH_KOULUTUSTYYPIT_FAILURE] : (state, action) => {
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
  data: []
}

export default function koulutustyypitReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
