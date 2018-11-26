import { API_BASE_URL } from "../constants"
import { getELYkeskusList } from "../../routes/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/ELYkeskusUtil"

// Constants
export const FETCH_ELYKESKUKSET_START = 'FETCH_ELYKESKUKSET_START'
export const FETCH_ELYKESKUKSET_SUCCESS = 'FETCH_ELYKESKUKSET_SUCCESS'
export const FETCH_ELYKESKUKSET_FAILURE = 'FETCH_ELYKESKUKSET_FAILURE'

// Actions
export function fetchELYkeskukset() {
  return (dispatch) => {
    dispatch({ type: FETCH_ELYKESKUKSET_START })

    const request = fetch(`${API_BASE_URL}/koodistot/koodit/elykeskukset`)

    request
      .then(response => response.json())
      .then(data => {
        dispatch({ type: FETCH_ELYKESKUKSET_SUCCESS, payload: data })
      })
      .catch(err => dispatch({ type: FETCH_ELYKESKUKSET_FAILURE, payload: err }))
  }
}

export const actions = {
  fetchELYkeskukset
}

// Action handlers
const ACTION_HANDLERS = {
  [FETCH_ELYKESKUKSET_START] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      fetched: false,
      hasErrored: false
    }
  },
  [FETCH_ELYKESKUKSET_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: true,
      hasErrored: false,
      data: action.payload,
      ELYkeskusList: getELYkeskusList(action.payload, 'FI')
    }
  },
  [FETCH_ELYKESKUKSET_FAILURE] : (state, action) => {
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

export default function ELYkeskuksetReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
