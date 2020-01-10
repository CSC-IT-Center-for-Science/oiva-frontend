import { API_BASE_URL } from "../../../../../../modules/constants";
import axios from "axios/index";
import { formatMuutospyynto, getAttachments } from "./muutospyyntoUtil";

// Constants
export const FETCH_MUUTOSPYYNTO_START = "FETCH_MUUTOSPYYNTO_START";
export const FETCH_MUUTOSPYYNTO_SUCCESS = "FETCH_MUUTOSPYYNTO_SUCCESS";
export const FETCH_MUUTOSPYYNTO_FAILURE = "FETCH_MUUTOSPYYNTO_FAILURE";

export const CREATE_MUUTOSPYYNTO_START = "CREATE_MUUTOSPYYNTO_START";
export const CREATE_MUUTOSPYYNTO_SUCCESS = "CREATE_MUUTOSPYYNTO_SUCCESS";
export const CREATE_MUUTOSPYYNTO_FAILURE = "CREATE_MUUTOSPYYNTO_FAILURE";

export const PREVIEW_MUUTOSPYYNTO_START = "PREVIEW_MUUTOSPYYNTO_START";
export const PREVIEW_MUUTOSPYYNTO_SUCCESS = "PREVIEW_MUUTOSPYYNTO_SUCCESS";
export const PREVIEW_MUUTOSPYYNTO_FAILURE = "PREVIEW_MUUTOSPYYNTO_FAILURE";

export const SAVE_MUUTOSPYYNTO_START = "SAVE_MUUTOSPYYNTO_START";
export const SAVE_MUUTOSPYYNTO_SUCCESS = "SAVE_MUUTOSPYYNTO_SUCCESS";
export const SAVE_MUUTOSPYYNTO_FAILURE = "SAVE_MUUTOSPYYNTO_FAILURE";

export const UPDATE_MUUTOSPYYNTO_START = "UPDATE_MUUTOSPYYNTO_START";
export const UPDATE_MUUTOSPYYNTO_SUCCESS = "UPDATE_MUUTOSPYYNTO_SUCCESS";
export const UPDATE_MUUTOSPYYNTO_FAILURE = "UPDATE_MUUTOSPYYNTO_FAILURE";

// Actions
export function fetchMuutospyynto(uuid) {
  if (uuid) {
    return dispatch => {
      dispatch({ type: FETCH_MUUTOSPYYNTO_START });

      const request = fetch(`${API_BASE_URL}/muutospyynnot/id/${uuid}`);

      request
        .then(response => response.json())
        .then(data => {
          dispatch({ type: FETCH_MUUTOSPYYNTO_SUCCESS, payload: data });
        })
        .catch(err =>
          dispatch({ type: FETCH_MUUTOSPYYNTO_FAILURE, payload: err })
        );
    };
  }
}

export function createMuutospyynto(uuid) {
  return dispatch => {
    dispatch({ type: CREATE_MUUTOSPYYNTO_START });
    return axios
      .post(`${API_BASE_URL}/muutospyynnot/tila/avoin/${uuid}`)
      .then(response => {
        dispatch({ type: CREATE_MUUTOSPYYNTO_SUCCESS, payload: response });
      })
      .catch(err => {
        dispatch({ type: CREATE_MUUTOSPYYNTO_FAILURE, payload: err });
      });
  };
}

export function saveMuutospyynto(muutospyynto) {
  const attachments = getAttachments(muutospyynto);
  const formatted = formatMuutospyynto(muutospyynto);

  console.log("muutospyynto", muutospyynto);

  let data = new FormData();
  var muutos = new Blob([JSON.stringify(formatted)], {
    type: "application/json"
  });
  data.append("muutospyynto", muutos, "muutospyynnön json-data");

  attachments.map(item => {
    if (item.tiedosto) data.append(item.tiedostoId, item.tiedosto, item.nimi);
  });

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

export function updateMuutospyynto(muutospyynto) {
  const formatted = formatMuutospyynto(muutospyynto);

  console.log("formatted-update", JSON.stringify(formatted));

  return dispatch => {
    dispatch({ type: UPDATE_MUUTOSPYYNTO_START });

    axios
      .post(`${API_BASE_URL}/muutospyynnot/update`, formatted, {
        withCredentials: true
      })
      .then(response => {
        dispatch({ type: UPDATE_MUUTOSPYYNTO_SUCCESS, payload: response });
      })
      .catch(err => {
        dispatch({ type: UPDATE_MUUTOSPYYNTO_FAILURE, payload: err });
      });
  };
}

export function previewMuutospyynto(muutospyynto) {
  const formatted = formatMuutospyynto(muutospyynto);

  console.log("formatted-preview", JSON.stringify(formatted));

  return dispatch => {
    dispatch({ type: PREVIEW_MUUTOSPYYNTO_START });

    return axios
      .put(`${API_BASE_URL}/pdf/muutospyyntoObjToPdf`, formatted, {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf"
        }
      })
      .then(response => {
        dispatch({ type: PREVIEW_MUUTOSPYYNTO_SUCCESS, payload: response });
      })
      .catch(err => {
        dispatch({ type: PREVIEW_MUUTOSPYYNTO_FAILURE, payload: err });
      });
  };
}

export const actions = {
  fetchMuutospyynto,
  createMuutospyynto,
  previewMuutospyynto,
  saveMuutospyynto,
  updateMuutospyynto
};

// Action handlers
const ACTION_HANDLERS = {
  [FETCH_MUUTOSPYYNTO_START]: (state, action) => {
    return {
      ...state,
      isFetching: true,
      fetched: false,
      hasErrored: false
    };
  },
  [FETCH_MUUTOSPYYNTO_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: true,
      hasErrored: false,
      data: action.payload
    };
  },
  [FETCH_MUUTOSPYYNTO_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: false,
      hasErrored: true
    };
  },
  [CREATE_MUUTOSPYYNTO_START]: (state, action) => {
    return {
      ...state,
      create: {
        isSubmitting: true,
        isCreated: false,
        hasErrored: false
      }
    };
  },
  [CREATE_MUUTOSPYYNTO_SUCCESS]: (state, action) => {
    return {
      ...state,
      create: {
        isSubmitting: false,
        isCreated: true,
        hasErrored: false,
        response: action.payload
      }
    };
  },
  [CREATE_MUUTOSPYYNTO_FAILURE]: (state, action) => {
    return {
      ...state,
      create: {
        isSubmitting: false,
        hasCreated: false,
        hasErrored: true,
        response: action.payload
      }
    };
  },
  [PREVIEW_MUUTOSPYYNTO_START]: (state, action) => {
    return {
      ...state,
      isFetching: true,
      fetched: false,
      hasErrored: false
    };
  },
  [PREVIEW_MUUTOSPYYNTO_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: true,
      hasErrored: false,
      pdf: action.payload
    };
  },
  [PREVIEW_MUUTOSPYYNTO_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: false,
      hasErrored: true
    };
  },
  [SAVE_MUUTOSPYYNTO_START]: (state, action) => {
    return {
      ...state,
      save: {
        isSaving: true,
        saved: false,
        hasErrored: false
      }
    };
  },
  [SAVE_MUUTOSPYYNTO_SUCCESS]: (state, action) => {
    return {
      ...state,
      save: {
        isSaving: false,
        saved: true,
        hasErrored: false,
        data: action.payload
      }
    };
  },
  [SAVE_MUUTOSPYYNTO_FAILURE]: (state, action) => {
    return {
      ...state,
      save: {
        isSaving: false,
        saved: false,
        hasErrored: true
      }
    };
  },
  [UPDATE_MUUTOSPYYNTO_START]: (state, action) => {
    return {
      ...state,
      update: {
        isUpdating: true,
        updated: false,
        hasErrored: false
      }
    };
  },
  [UPDATE_MUUTOSPYYNTO_SUCCESS]: (state, action) => {
    return {
      ...state,
      update: {
        isUpdating: false,
        updated: true,
        hasErrored: false
      }
    };
  },
  [UPDATE_MUUTOSPYYNTO_FAILURE]: (state, action) => {
    return {
      ...state,
      update: {
        isUpdating: false,
        updated: false,
        hasErrored: true
      }
    };
  }
};

// Reducer
const initialState = {
  isFetching: false,
  fetched: false,
  hasErrored: false,
  data: {},
  create: undefined
};

export default function muutospyyntoReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
