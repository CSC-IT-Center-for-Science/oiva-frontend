import {
  SET_BACKEND_CHANGES,
  SAVE_MUUTOSPYYNTO_START,
  SAVE_MUUTOSPYYNTO_SUCCESS,
  SAVE_MUUTOSPYYNTO_FAILURE,
  SET_SECTION_DATA,
  DOWNLOAD_ATTACHMENT_START,
  DOWNLOAD_ATTACHMENT_SUCCESS,
  DOWNLOAD_ATTACHMENT_FAILURE,
  SEND_MUUTOSPYYNTO_SUCCESS
} from "./actionTypes";

export default function(state, action) {
  switch (action.type) {
    case SET_BACKEND_CHANGES:
      return {
        ...state,
        backendChanges: action.changes
      };
    case SET_SECTION_DATA:
      return {
        ...state,
        [action.payload.sectionId]: {
          ...(state[action.payload.sectionId] || {}),
          state: action.payload
        }
      };
    case SAVE_MUUTOSPYYNTO_START:
      return {
        ...state,
        save: {
          isSaving: true,
          saved: false,
          hasErrored: false
        }
      };
    case SAVE_MUUTOSPYYNTO_SUCCESS:
      return {
        ...state,
        save: {
          isSaving: false,
          saved: true,
          hasErrored: false,
          triggerPreview: action.payload.triggerPreview,
          data: action.payload.response
        }
      };
    case SAVE_MUUTOSPYYNTO_FAILURE:
      return {
        ...state,
        save: {
          isSaving: false,
          saved: false,
          hasErrored: true
        }
      };
    case DOWNLOAD_ATTACHMENT_START:
      return {
        ...state,
        isDownloading: true,
        hasErrored: false
      };

    case DOWNLOAD_ATTACHMENT_SUCCESS:
      return {
        ...state,
        isDownloading: false,
        hasErrored: false,
        tiedosto: action.payload
      };
    case DOWNLOAD_ATTACHMENT_FAILURE:
      return {
        ...state,
        isDownloading: false,
        updated: false,
        hasErrored: true
      };
    case SEND_MUUTOSPYYNTO_SUCCESS:
      return {
        ...state,
        readyToCloseWizard: true
      };
    default:
      return state;
  }
}
