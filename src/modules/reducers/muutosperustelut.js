import { API_BASE_URL } from "../constants"
import { getMuutosperusteluList } from "../../routes/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/muutosperusteluUtil"

// Constants
export const FETCH_MUUTOSPERUSTELUT_START = 'FETCH_MUUTOSPERUSTELUT_START'
export const FETCH_MUUTOSPERUSTELUT_SUCCESS = 'FETCH_MUUTOSPERUSTELUT_SUCCESS'
export const FETCH_MUUTOSPERUSTELUT_FAILURE = 'FETCH_MUUTOSPERUSTELUT_FAILURE'

// Actions
export function fetchMuutosperustelut() {
  return (dispatch) => {
    dispatch({ type: FETCH_MUUTOSPERUSTELUT_START })

    const request = fetch(`${API_BASE_URL}/koodistot/koodit/oivaperustelut`)

    request
      .then(response => response.json())
      .then(data => {
        dispatch({ type: FETCH_MUUTOSPERUSTELUT_SUCCESS, payload: data })
      })
      .catch(err => dispatch({ type: FETCH_MUUTOSPERUSTELUT_FAILURE, payload: err }))
  }
}

export const actions = {
  fetchMuutosperustelut
}

// Action handlers
const ACTION_HANDLERS = {
  [FETCH_MUUTOSPERUSTELUT_START] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      fetched: false,
      hasErrored: false
    }
  },
  [FETCH_MUUTOSPERUSTELUT_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: true,
      hasErrored: false,
      data: action.payload,
      muutosperusteluList: getMuutosperusteluList(action.payload, 'FI')
    }
  },
  [FETCH_MUUTOSPERUSTELUT_FAILURE] : (state, action) => {
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

export default function muutosperustelutReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
