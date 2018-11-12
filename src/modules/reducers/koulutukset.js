import { API_BASE_URL } from "../constants"
import { parseKoulutuksetAll, parseMuut } from "../../routes/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/koulutusParser"

// Constants
export const FETCH_KOULUTUKSET_ALL_START = 'FETCH_KOULUTUKSET_ALL_START'
export const FETCH_KOULUTUKSET_ALL_SUCCESS = 'FETCH_KOULUTUKSET_ALL_SUCCESS'
export const FETCH_KOULUTUKSET_ALL_FAILURE = 'FETCH_KOULUTUKSET_ALL_FAILURE'

export const FETCH_KOULUTUKSET_MUUT_START = 'FETCH_KOULUTUKSET_MUUT_START'
export const FETCH_KOULUTUKSET_MUUT_SUCCESS = 'FETCH_KOULUTUKSET_MUUT_SUCCESS'
export const FETCH_KOULUTUKSET_MUUT_FAILURE = 'FETCH_KOULUTUKSET_MUUT_FAILURE'

export const FETCH_KOULUTUS_START = 'FETCH_KOULUTUS_START'
export const FETCH_KOULUTUS_SUCCESS = 'FETCH_KOULUTUS_SUCCESS'
export const FETCH_KOULUTUS_FAILURE = 'FETCH_KOULUTUS_FAILURE'

// Actions
export function fetchKoulutuksetAll() {
  return (dispatch) => {
    dispatch({ type: FETCH_KOULUTUKSET_ALL_START })

    const request = fetch(`${API_BASE_URL}/koodistot/ammatillinen/tutkinnot`)

    request
      .then(response => response.json())
      .then(data => {
        dispatch({ type: FETCH_KOULUTUKSET_ALL_SUCCESS, payload: data })
      })
      .catch(err => dispatch({ type: FETCH_KOULUTUKSET_ALL_FAILURE, payload: err }))
  }
}

export function fetchKoulutuksetMuut(koodisto) {
  return (dispatch) => {
    dispatch({ type: FETCH_KOULUTUKSET_MUUT_START })

    const request = fetch(`${API_BASE_URL}/koodistot/koodit/${koodisto}`)

    request
      .then(response => response.json())
      .then(data => {
        dispatch({ type: FETCH_KOULUTUKSET_MUUT_SUCCESS, payload: data, koodisto: koodisto })
      })
      .catch(err => dispatch({ type: FETCH_KOULUTUKSET_MUUT_FAILURE, payload: err }))
  }
}

export function fetchKoulutus(koodi) {
  return (dispatch) => {
    dispatch({ type: FETCH_KOULUTUS_START })

    const request = fetch(`${API_BASE_URL}/koodistot/koodi/koulutus/${koodi}`)

    request
      .then(response => response.json())
      .then(data => {
        dispatch({ type: FETCH_KOULUTUS_SUCCESS, payload: data, koodi: koodi })
      })
      .catch(err => dispatch({ type: FETCH_KOULUTUS_FAILURE, payload: err }))
  }
}

export const actions = {
  fetchKoulutuksetAll,
  fetchKoulutus
}

// Action handlers
const ACTION_HANDLERS = {
  [FETCH_KOULUTUKSET_ALL_START] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      fetched: false,
      hasErrored: false
    }
  },
  [FETCH_KOULUTUKSET_ALL_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: true,
      hasErrored: false,
      koulutusdata: parseKoulutuksetAll(action.payload)
    }
  },
  [FETCH_KOULUTUKSET_ALL_FAILURE] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: false,
      hasErrored: true
    }
  },
  [FETCH_KOULUTUKSET_MUUT_START] : (state, action) => {
    return {
      ...state,
      muut: {
        isFetching: true,
        fetched: false,
        hasErrored: false
      }
    }
  },
  [FETCH_KOULUTUKSET_MUUT_SUCCESS] : (state, action) => {
    return {
      ...state,
      muut: {
        isFetching: false,
        fetched: true,
        hasErrored: false,
        muudata: {
          ...state.muut.muudata,
          [action.koodisto]: parseMuut(action.payload)
        }
      }
    }
  },
  [FETCH_KOULUTUKSET_MUUT_FAILURE] : (state, action) => {
    return {
      ...state,
      muut: {
        isFetching: false,
        fetched: false,
        hasErrored: true
      }
    }
  },
  [FETCH_KOULUTUS_START] : (state, action) => {
    return {
      ...state,
      poikkeukset: {
        ...state.poikkeukset,
        isFetching: true,
        fetched: false,
        hasErrored: false
      }
    }
  },
  [FETCH_KOULUTUS_SUCCESS] : (state, action) => {
    return {
      ...state,
      poikkeukset: {
        ...state.poikkeukset,
        isFetching: false,
        fetched: true,
        hasErrored: false,
        data: [ ...state.poikkeukset.data, action.payload ]
      }
    }
  },
  [FETCH_KOULUTUS_FAILURE] : (state, action) => {
    return {
      ...state,
      poikkeukset: {
        ...state.poikkeukset,
        isFetching: false,
        fetched: false,
        hasErrored: true
      }
    }
  }
}

// Reducer
const initialState = {
  isFetching: false,
  fetched: false,
  hasErrored: false,
  data: {},
  muut: {
    isFetching: false,
    fetched: false,
    hasErrored: false,
    muudata: undefined
  },
  poikkeukset: {
    isFetching: false,
    fetched: false,
    hasErrored: false,
    data: []
  }
}

export default function koulutuksetReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
