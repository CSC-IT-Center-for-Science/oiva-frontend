import { API_BASE_URL } from "../constants"
import { getMaakuntakunnatList } from "../../routes/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/toimialueUtil"

// Constants
export const FETCH_MAAKUNTAKUNNAT_START = 'FETCH_MAAKUNTAKUNNAT_START'
export const FETCH_MAAKUNTAKUNNAT_SUCCESS = 'FETCH_MAAKUNTAKUNNAT_SUCCESS'
export const FETCH_MAAKUNTAKUNNAT_FAILURE = 'FETCH_MAAKUNTAKUNNAT_FAILURE'

// Actions
export function fetchMaakuntakunnat() {
  return (dispatch) => {
    dispatch({ type: FETCH_MAAKUNTAKUNNAT_START })

    const request = fetch(`${API_BASE_URL}/koodistot/maakuntakunta`)

    request
      .then(response => response.json())
      .then(data => { dispatch({ type: FETCH_MAAKUNTAKUNNAT_SUCCESS, payload: data }) })
      .catch(err => { dispatch({ type: FETCH_MAAKUNTAKUNNAT_FAILURE, payload: err }) })
  }
}

export const actions = {
  fetchMaakuntakunnat
}

// Action handlers
const ACTION_HANDLERS = {
  [FETCH_MAAKUNTAKUNNAT_START] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      fetched: false,
      hasErrored: false
    }
  },
  [FETCH_MAAKUNTAKUNNAT_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: true,
      hasErrored: false,
      data: action.payload,
      maakuntakunnatList: getMaakuntakunnatList(action.payload, 'FI')
    }
  },
  [FETCH_MAAKUNTAKUNNAT_FAILURE] : (state, action) => {
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

export default function maakuntakunnatReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
