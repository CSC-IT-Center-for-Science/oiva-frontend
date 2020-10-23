import {
  createStore,
  createHook,
  createSubscriber,
  createContainer
} from "react-sweet-state";
import {
  append,
  assoc,
  assocPath,
  dissocPath,
  endsWith,
  filter,
  flatten,
  isEmpty,
  length,
  map,
  max,
  path,
  prop,
  reduce,
  split,
  startsWith
} from "ramda";
import { getAnchorPart, replaceAnchorPartWith } from "utils/common";
import { createSelector } from "reselect";

const Store = createStore({
  initialState: { tutkinnot: [] },
  actions: {
    setChanges: (changeObjects, anchor) => ({ getState, setState }) => {
      //   if (!anchor && changeObjects) {
      //     setState(assoc("changeObjects", changeObjects, getState()));
      //   }

      if (anchor && changeObjects) {
        setState(assocPath(split("_", anchor), changeObjects, getState()));
      }
      // Properties not including Toimintaalue and Tutkintokielet are deleted if empty.
      if (
        anchor &&
        anchor !== "toimintaalue" &&
        anchor !== "kielet_tutkintokielet" &&
        isEmpty(changeObjects)
      ) {
        setState(dissocPath(split("_", anchor), getState()));
      }
    }
  },
  name: "Muutokset"
});

const getChangeObjectsBySectionId = (state, { anchor }) => {
  console.info(state, anchor, path(split("_", anchor), state));
  return path(split("_", anchor), state);
};

const getTutkinnotChanges = createSelector(
  state => state.tutkinnot,
  tutkinnot => ({ tukinnot: { "01": [] } })
);

export const useTutkinnotChanges = createHook(Store, {
  selector: getTutkinnotChanges
});
export const useMuutokset = createHook(Store);
export const useLomake = createHook(Store, {
  selector: getChangeObjectsBySectionId
});

// export const LomakeSubscriber = createSubscriber(Store, {
//   selector: getChangeObjectsBySectionId
// });
export const MuutoksetSubscriber = createSubscriber(Store);
export const MuutoksetContainer = createContainer(Store, {
  onInit: () => ({ setState }, initialState) => {
    setState(initialState);
  }
});
