import axios from "axios/index";
import { API_BASE_URL } from "../../modules/constants";

import {
  SET_BACKEND_CHANGES,
  SAVE_MUUTOSPYYNTO_START,
  SAVE_MUUTOSPYYNTO_SUCCESS,
  SAVE_MUUTOSPYYNTO_FAILURE,
  SET_SECTION_DATA,
  DOWNLOAD_ATTACHMENT_START,
  DOWNLOAD_ATTACHMENT_SUCCESS,
  DOWNLOAD_ATTACHMENT_FAILURE
} from "./actionTypes";

export const setBackendChanges = changes => {
  return dispatch => {
    dispatch({
      type: SET_BACKEND_CHANGES,
      changes
    });
  };
};

export const setSectionData = payload => {
  return dispatch => {
    dispatch({
      type: SET_SECTION_DATA,
      payload
    });
  };
};

export function saveMuutospyynto(muutospyynto, attachments) {
  let data = new FormData();
  var muutos = new Blob([JSON.stringify(muutospyynto)], {
    type: "application/json"
  });
  data.append("muutospyynto", muutos, "muutospyynnön json-data");

  if (attachments) {
    attachments.map(item => {
      if (!item.removed && item.new && item.tiedosto instanceof Blob) {
        data.append(item.tiedostoId, item.tiedosto, item.filename);
        item.tiedosto = null;
      }
      return null;
    });
  }
  return dispatch => {
    dispatch({ type: SAVE_MUUTOSPYYNTO_START });

    return axios
      .post(`${API_BASE_URL}/muutospyynnot/tallenna`, data, {
        withCredentials: true
      })
      .then(response => {
        dispatch({ type: SAVE_MUUTOSPYYNTO_SUCCESS, payload: response });
      })
      .catch(err => {
        dispatch({ type: SAVE_MUUTOSPYYNTO_FAILURE, payload: err });
      });
  };
}

export function downloadAttachment(uuid) {
  return dispatch => {
    dispatch({ type: DOWNLOAD_ATTACHMENT_START });
    return axios
      .post(`${API_BASE_URL}/liitteet/${uuid}`)
      .then(response => {
        dispatch({ type: DOWNLOAD_ATTACHMENT_SUCCESS, payload: response });
      })
      .catch(err => {
        dispatch({ type: DOWNLOAD_ATTACHMENT_FAILURE, payload: err });
      });
  };
}
