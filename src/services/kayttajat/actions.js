// import useFetch from "../../hooks/useFetch";
import _ from "lodash";
import axios from "axios";
import {
  API_BASE_URL,
  ROLE_ESITTELIJA,
  ROLE_KATSELIJA,
  ROLE_KAYTTAJA,
  ROLE_NIMENKIRJOITTAJA,
  ROLE_YLLAPITAJA
} from "modules/constants";
import {
  LOGIN_GET_ROLES_START,
  LOGIN_GET_ROLES_SUCCESS,
  LOGIN_GET_ROLES_FAILURE,
  LOGOUT_USER_START,
  GET_ORGANISATION_START,
  GET_ORGANISATION_SUCCESS,
  GET_ORGANISATION_FAILURE
} from "./actionTypes";

export function getRoles() {
  return dispatch => {
    dispatch({ type: LOGIN_GET_ROLES_START });

    return axios
      .get(`${API_BASE_URL}/auth/me`, { withCredentials: true })
      .then(response => {
        let userObj = JSON.parse(JSON.stringify(response.data));
        sessionStorage.setItem("role", "");
        sessionStorage.setItem("username", userObj.username);
        sessionStorage.setItem("oid", userObj.oid);
        const role = [
          ROLE_YLLAPITAJA,
          ROLE_ESITTELIJA,
          ROLE_KAYTTAJA,
          ROLE_NIMENKIRJOITTAJA,
          ROLE_KATSELIJA
        ].find(role => _.indexOf(userObj.roles, role) > -1);
        if (role) {
          sessionStorage.setItem("role", role);
        }

        // TODO: error logging?

        dispatch({ type: LOGIN_GET_ROLES_SUCCESS, payload: response.data });
      })
      .catch(err => {
        dispatch({ type: LOGIN_GET_ROLES_FAILURE, payload: err });
      })
  };
}

export function getOrganization(oid) {
  return dispatch => {
    dispatch({ type: GET_ORGANISATION_START });
    if (!oid) {
      return;
    }
    const request = fetch(`${API_BASE_URL}/organisaatiot/${oid}`);

    request
      .then(response => response.json())
      .then(data => {
        dispatch({ type: GET_ORGANISATION_SUCCESS, payload: data });
      })
      .catch(err => dispatch({ type: GET_ORGANISATION_FAILURE, payload: err }));
  };
}

export function logoutUser() {
  return dispatch => {
    dispatch({ type: LOGOUT_USER_START });
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("oid");
    sessionStorage.removeItem("role");
  };
}
