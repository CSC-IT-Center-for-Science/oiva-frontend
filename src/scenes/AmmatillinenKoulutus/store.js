import { createStore, createHook, createContainer } from "react-sweet-state";
import {
  assoc,
  assocPath,
  difference,
  flatten,
  isEmpty,
  map,
  mergeAll,
  path,
  prepend,
  split,
  symmetricDifference
} from "ramda";
import { recursiveTreeShake } from "utils/common";

const setLatestChanges = diff => ({ getState, setState }) => {
  setState(assoc("latestChanges", diff, getState()));
};

const Store = createStore({
  initialState: {
    changeObjects: {}
  },
  actions: {
    setChanges: (changeObjects, anchor = "") => ({
      getState,
      dispatch,
      setState
    }) => {
      const currentChangeObjects = getState().changeObjects;
      const anchorParts = split("_", anchor);
      const unsavedFullPath = prepend("unsaved", anchorParts).filter(Boolean);
      const savedFullPath = prepend("saved", anchorParts).filter(Boolean);
      const savedByAnchor = path(savedFullPath, getState().changeObjects) || [];
      const currentStateOfAnchor = path(unsavedFullPath, currentChangeObjects);
      const unsavedChangeObjects = difference(changeObjects, savedByAnchor);
      const savedChangeObjects = difference(savedByAnchor, changeObjects);

      let nextChangeObjects = assocPath(
        unsavedFullPath,
        unsavedChangeObjects,
        currentChangeObjects
      );

      const nextSavedByAnchor = difference(savedByAnchor, savedChangeObjects);

      nextChangeObjects = assocPath(
        savedFullPath,
        nextSavedByAnchor,
        nextChangeObjects
      );

      if (isEmpty(unsavedChangeObjects)) {
        nextChangeObjects = recursiveTreeShake(
          unsavedFullPath,
          nextChangeObjects
        );
      }

      if (isEmpty(nextSavedByAnchor)) {
        nextChangeObjects = recursiveTreeShake(
          savedFullPath,
          nextChangeObjects
        );
      }

      const nextStateOfAnchor = path(unsavedFullPath, nextChangeObjects);
      setState(assoc("changeObjects", nextChangeObjects, getState()));
      dispatch(
        setLatestChanges(
          symmetricDifference(
            nextStateOfAnchor || [],
            currentStateOfAnchor || []
          )
        )
      );
    },
    setSavedChanges: (changeObjects, anchor) => ({ getState, setState }) => {
      if (anchor) {
        setState(
          assocPath(split(".", anchor), changeObjects, getState().changeObjects)
        );
      } else {
        const nextState = assocPath(
          ["changeObjects", "saved"],
          changeObjects,
          getState()
        );
        console.info(nextState);
        setState(nextState);
      }
    }
  },
  name: "Muutokset"
});

const getChangeObjectsByAnchor = (
  state,
  { anchor },
  keys = ["unsaved", "saved"]
) => {
  return mergeAll(
    flatten(
      map(key => {
        return {
          [key]:
            path(prepend(key, split("_", anchor)), state.changeObjects) || []
        };
      }, keys)
    )
  );
};

const getChangeObjects = (state, { anchor }) => {
  const anchorParts = split("_", anchor);
  return flatten([
    path(prepend("saved", anchorParts), state.changeObjects) || [],
    path(prepend("unsaved", anchorParts), state.changeObjects) || []
  ]);
};

export const useLomake = createHook(Store);

export const useLatestChanges = createHook(Store, {
  selector: state => state.latestChanges
});

export const useChangeObjectsByAnchor = createHook(Store, {
  selector: getChangeObjects
});

export const useChangeObjects = createHook(Store);

export const useLomakeSection = createHook(Store, {
  selector: getChangeObjectsByAnchor
});

export const useUnsavedChangeObjects = createHook(Store, {
  selector: state => state.changeObjects.unsaved
});

export const MuutoksetContainer = createContainer(Store, {
  onInit: () => ({ setState }, initialState) => {
    setState(initialState);
  }
});
