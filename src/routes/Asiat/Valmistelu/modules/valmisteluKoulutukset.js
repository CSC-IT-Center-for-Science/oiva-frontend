import { API_BASE_URL } from "../../../../modules/constants"
import { parseKoulutuksetAll } from "./valmisteluKoulutusParser"

// Constants
export const FETCH_KOULUTUKSET_ALL_START = 'FETCH_KOULUTUKSET_ALL_START'
export const FETCH_KOULUTUKSET_ALL_SUCCESS = 'FETCH_KOULUTUKSET_ALL_SUCCESS'
export const FETCH_KOULUTUKSET_ALL_FAILURE = 'FETCH_KOULUTUKSET_ALL_FAILURE'

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

export const actions = {
    fetchKoulutuksetAll
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
    }
}

// Reducer
const initialState = {
    isFetching: false,
    fetched: false,
    hasErrored: false,
    data: {}
}

export default function koulutuksetReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
