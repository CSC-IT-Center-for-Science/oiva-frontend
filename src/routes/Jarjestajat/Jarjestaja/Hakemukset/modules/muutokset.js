import _ from 'lodash'

// Constants
export const TOGGLE_LUPASECTION_ISREMOVING = 'TOGGLE_LUPASECTION_ISREMOVING'

export const TUTKINTO_ADD_TO_BE_REMOVED = 'TUTKINTO_ADD_TO_BE_REMOVED'
export const TUTKINTO_REMOVE_FROM_TO_BE_REMOVED = 'TUTKINTO_REMOVE_FROM_TO_BE_REMOVED'
export const TUTKINTO_CLEAR_TO_BE_REMOVED = 'TUTKINTO_CLEAR_TO_BE_REMOVED'

// Actions
export function toggleLupaSectionIsRemoving() {
  return (dispatch) => {
    dispatch({ type: TOGGLE_LUPASECTION_ISREMOVING })
  }
}

export function removeTutkinto(tutkinto) {
  return (dispatch) => {
    dispatch({ type: TUTKINTO_ADD_TO_BE_REMOVED, payload: tutkinto })
  }
}

export function undoRemoveTutkinto(tutkinto) {
  return (dispatch) => {
    dispatch({ type: TUTKINTO_REMOVE_FROM_TO_BE_REMOVED, payload: tutkinto })
  }
}

export function clearToBeRemoved() {
  return (dispatch) => {
    dispatch({ type: TUTKINTO_CLEAR_TO_BE_REMOVED })
  }
}

export const actions = {
  toggleLupaSectionIsRemoving,

}

// Action handlers
const ACTION_HANDLERS = {
  [TOGGLE_LUPASECTION_ISREMOVING]: (state, action) => {
    return {
      ...state,
      isRemoving: !state.isRemoving
    }
  },
  [TUTKINTO_ADD_TO_BE_REMOVED]: (state, action) => {
    let { muutokset } = state
    muutokset.push(action.payload)

    return {
      ...state,
      muutokset
    }
  },
  [TUTKINTO_REMOVE_FROM_TO_BE_REMOVED]: (state, action) => {
    let { muutokset } = state
    _.remove(muutokset, (muutos) => { return muutos.maaraysId === action.payload.maaraysId })

    return {
      ...state,
      muutokset
    }
  },
  [TUTKINTO_CLEAR_TO_BE_REMOVED]: (state, action) => {
    return {
      ...state,
      muutokset: []
    }
  }
}

// Reducer
const initialState = {
  isRemoving: false,
  muutokset: [],
}

export default function lupasectionReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
