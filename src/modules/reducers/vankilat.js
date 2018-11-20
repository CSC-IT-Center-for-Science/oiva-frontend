import { API_BASE_URL } from "../constants"
import { getVankilaList } from "../../routes/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/vankilaUtil"

// Constants
export const FETCH_VANKILAT_START = 'FETCH_VANKILAT_START'
export const FETCH_VANKILAT_SUCCESS = 'FETCH_VANKILAT_SUCCESS'
export const FETCH_VANKILAT_FAILURE = 'FETCH_VANKILAT_FAILURE'

// Actions
export function fetchVankilat() {
  return (dispatch) => {
    dispatch({ type: FETCH_VANKILAT_START })

    const request = fetch(`${API_BASE_URL}/koodistot/koodit/vankilat`)

    request
      .then(response => response.json())
      .then(data => {
        dispatch({ type: FETCH_VANKILAT_SUCCESS, payload: data })
      })
      .catch(err => dispatch({ type: FETCH_VANKILAT_FAILURE, payload: err }))
  }
}

export const actions = {
  fetchVankilat
}

// Action handlers
const ACTION_HANDLERS = {
  [FETCH_VANKILAT_START] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      fetched: false,
      hasErrored: false
    }
  },
  [FETCH_VANKILAT_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: true,
      hasErrored: false,
      data: action.payload,
      vankilaList: getVankilaList(action.payload, 'FI')
    }
  },
  [FETCH_VANKILAT_FAILURE] : (state, action) => {
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

export default function vankilatReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
