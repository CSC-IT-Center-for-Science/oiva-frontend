import axios from 'axios'
import _ from 'lodash'

import { API_BASE_URL } from 'modules/constants'
import { ROLE_ESITTELIJA, ROLE_KAYTTAJA } from 'modules/constants'

// Constants
export const DUMMY_LOGIN_USER = 'DUMMY_LOGIN_USER'
export const DUMMY_LOGOUT_USER = 'DUMMY_LOGOUT_USER'

export const LOGIN_GET_ROLES_START = 'LOGIN_GET_ROLES_START'
export const LOGIN_GET_ROLES_SUCCESS = 'LOGIN_GET_ROLES_SUCCESS'
export const LOGIN_GET_ROLES_FAILURE = 'LOGIN_GET_ROLES_FAILURE'

export const LOGOUT_USER_START = 'LOGOUT_USER_START'
export const LOGOUT_USER_SUCCESS = 'LOGOUT_USER_SUCCESS'
export const LOGOUT_USER_FAILURE = 'LOGOUT_USER_FAILURE'

export const GET_ORGANISATION_START = 'GET_ORGANISATION_START'
export const GET_ORGANISATION_SUCCESS = 'GET_ORGANISATION_SUCCESS'
export const GET_ORGANISATION_FAILURE = 'GET_ORGANISATION_FAILURE'

// Actions
export function getRoles() {
  return (dispatch) => {
    dispatch({ type: LOGIN_GET_ROLES_START })
    
    return axios.get(`${API_BASE_URL}/auth/me`, { withCredentials: true })
      .then((response) => {

          let userObj = JSON.parse(JSON.stringify(response.data))
          sessionStorage.setItem('role', '')
          sessionStorage.setItem('username', userObj.username)
          sessionStorage.setItem('oid', userObj.oid)
          if(_.indexOf(userObj.roles, ROLE_ESITTELIJA) > -1) {
              sessionStorage.setItem('role', ROLE_ESITTELIJA)
          } else if(_.indexOf(userObj.roles, ROLE_KAYTTAJA) > -1) {
              sessionStorage.setItem('role', ROLE_KAYTTAJA)
          }

          // TODO: error logging?

          dispatch({ type: LOGIN_GET_ROLES_SUCCESS, payload: response.data })
      })
      .catch((err) => dispatch({ type: LOGIN_GET_ROLES_FAILURE, payload: err }))
      
  }
}

export function getOrganisation(oid) {
    return (dispatch) => {
        dispatch({ type: GET_ORGANISATION_START })
        const request = fetch(`${API_BASE_URL}/organisaatiot/${oid}`)

        request
            .then((response) => response.json())
            .then((data) => {
                dispatch({ type: GET_ORGANISATION_SUCCESS, payload: data })
            })
            .catch((err) => dispatch({ type: GET_ORGANISATION_FAILURE, payload: err }))

    }

}

export function logoutUser() {
  return (dispatch) => {

      dispatch({ type: LOGOUT_USER_START })

      axios.get(`${API_BASE_URL}/auth/logout`, { withCredentials: true })
          .then((response) => response.json())
          .then((data) => {
              dispatch({ type: LOGOUT_USER_SUCCESS, payload: data })
          })
          .catch((err) => dispatch({ type: LOGOUT_USER_FAILURE, payload: err }))

      sessionStorage.removeItem('username')
      sessionStorage.removeItem('oid')
      sessionStorage.removeItem('role')

  }
}

export function dummyLogoutUser() {
  return {
    type: DUMMY_LOGOUT_USER,
    payload: null
  }
}

export function dummyLoginUser(values) {
  return {
    type: DUMMY_LOGIN_USER,
    payload: values
  }
}

export const actions = {
  getRoles,
  logoutUser,
  getOrganisation,
  dummyLogoutUser,
  dummyLoginUser
}

// Action handlers
const ACTION_HANDLERS = {
  [LOGIN_GET_ROLES_START] : (state, action) => {
        return {
            ...state,
            isFetching: true,
            fetched: false,
            hasErrored: false
        }
    },
    [LOGIN_GET_ROLES_SUCCESS] : (state, action) => {
        return {
            ...state,
            user: action.payload,
            isFetching: false,
            fetched: true,
            hasErrored: false
        }
    },
    [LOGIN_GET_ROLES_FAILURE] : (state, action) => {
        return {
            ...state,
            isFetching: false,
            fetched: false,
            hasErrored: true
        }
    },
    [GET_ORGANISATION_START] : (state, action) => {
        return {
            ...state,
            oppilaitos: {
                isFetching: true,
                fetched: false,
                hasErrored: false
            }
        }
    },
    [GET_ORGANISATION_SUCCESS] : (state, action) => {
        return {
            ...state,
            oppilaitos: {
                organisaatio: action.payload,
                isFetching: false,
                fetched: true,
                hasErrored: false
            }
        }
    },
    [GET_ORGANISATION_FAILURE] : (state, action) => {
        return {
            ...state,
            oppilaitos: {
                isFetching: true,
                fetched: false,
                hasErrored: false
            }
        }
    },
  [LOGOUT_USER_START] : (state, action) => {
    return {
      ...state,
      user: null
    }
  }
}

// Reducer
const initialState = {
  user: {},
  isFetching: false,
  fetched: false,
  hasErrored: false
}

export default function userReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
