import { API_BASE_URL } from "../constants"
import { getMuutosperusteluList } from "../../routes/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/muutosperusteluUtil"

// Constants
export const FETCH_MUUTOSPERUSTELUTOPISKELIJAVUODET_START = 'FETCH_MUUTOSPERUSTELUTOPISKELIJAVUODET_START'
export const FETCH_MUUTOSPERUSTELUTOPISKELIJAVUODET_SUCCESS = 'FETCH_MUUTOSPERUSTELUTOPISKELIJAVUODET_SUCCESS'
export const FETCH_MUUTOSPERUSTELUTOPISKELIJAVUODET_FAILURE = 'FETCH_MUUTOSPERUSTELUTOPISKELIJAVUODET_FAILURE'

// Actions
export function fetchMuutosperustelutOpiskelijavuodet() {
  return (dispatch) => {
    dispatch({ type: FETCH_MUUTOSPERUSTELUTOPISKELIJAVUODET_START })

    const request = fetch(`${API_BASE_URL}/koodistot/koodit/oivaperustelutopiskelijavuodet`)

    request
      .then(response => response.json())
      .then(data => {
        dispatch({ type: FETCH_MUUTOSPERUSTELUTOPISKELIJAVUODET_SUCCESS, payload: data })
      })
      .catch(err => dispatch({ type: FETCH_MUUTOSPERUSTELUTOPISKELIJAVUODET_FAILURE, payload: err }))

  }
}

export const actions = {
  fetchMuutosperustelutOpiskelijavuodet
}

// Action handlers
const ACTION_HANDLERS = {
  [FETCH_MUUTOSPERUSTELUTOPISKELIJAVUODET_START] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      fetched: false,
      hasErrored: false
    }
  },
  [FETCH_MUUTOSPERUSTELUTOPISKELIJAVUODET_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: true,
      hasErrored: false,
      data: action.payload,
      muutosperusteluList: getMuutosperusteluList(action.payload, 'FI')
    }
  },
  [FETCH_MUUTOSPERUSTELUTOPISKELIJAVUODET_FAILURE] : (state, action) => {
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

export default function muutosperustelutOpiskelijavuodetReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
