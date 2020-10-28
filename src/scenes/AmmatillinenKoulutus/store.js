import { createStore, createHook, createContainer } from "react-sweet-state";
import {
  assoc,
  assocPath,
  difference,
  flatten,
  isEmpty,
  path,
  prepend,
  split,
  symmetricDifference,
  without
} from "ramda";
import { recursiveTreeShake } from "utils/common";

const setLatestChanges = diff => ({ getState, setState }) => {
  setState(assoc("latestChanges", diff, getState()));
};

const Store = createStore({
  initialState: {
    changeObjects: {
      saved: {},
      unsaved: {},
      underRemoval: {}
    }
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
      const underRemovalFullPath = prepend("underRemoval", anchorParts).filter(
        Boolean
      );

      const savedByAnchor = path(savedFullPath, getState().changeObjects) || [];
      const currentStateOfAnchor = path(unsavedFullPath, currentChangeObjects);
      const unsavedChangeObjects = difference(changeObjects, savedByAnchor);
      const savedChangeObjects = difference(savedByAnchor, changeObjects);

      /**
       * Etsitään ankkuria käyttäen vastaavat underRemoval-tilassa olevat
       * muutokset.
       */
      const underRemovalByAnchor =
        path(underRemovalFullPath, getState().changeObjects) || [];

      // difference(savedByAnchor, changeObjects);

      /**
       * Etsitään löydetyistä muutosobjekteista ne, joita vastaavia muutos-
       * objekteja ollaan tallentamassa.
       */
      const freshNewChangeObjects = difference(
        unsavedChangeObjects,
        underRemovalByAnchor
      );

      console.info("Fresh:", freshNewChangeObjects);

      // let nextChangeObjects = assocPath(
      //   unsavedFullPath,
      //   unsavedChangeObjects,
      //   currentChangeObjects
      // );

      let nextChangeObjects = assocPath(
        unsavedFullPath,
        freshNewChangeObjects,
        currentChangeObjects
      );

      const nextSavedByAnchor = difference(savedByAnchor, savedChangeObjects);

      nextChangeObjects = assocPath(
        underRemovalFullPath,
        savedChangeObjects,
        nextChangeObjects
      );

      nextChangeObjects = recursiveTreeShake(
        unsavedFullPath,
        nextChangeObjects
      );
      nextChangeObjects = recursiveTreeShake(
        underRemovalFullPath,
        nextChangeObjects
      );
      nextChangeObjects = recursiveTreeShake(
        unsavedFullPath,
        nextChangeObjects
      );

      console.info(nextChangeObjects);

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

const getChangeObjects = (state, { anchor }) => {
  const anchorParts = split("_", anchor);
  const underRemoval =
    path(prepend("underRemoval", anchorParts), state.changeObjects) || [];
  const allChangeObjects = flatten([
    path(prepend("saved", anchorParts), state.changeObjects) || [],
    path(prepend("unsaved", anchorParts), state.changeObjects) || []
  ]);
  return difference(allChangeObjects, underRemoval);
};

export const useLomake = createHook(Store);

export const useLatestChanges = createHook(Store, {
  selector: state => state.latestChanges
});

export const useChangeObjectsByAnchor = createHook(Store, {
  selector: getChangeObjects
});

export const useChangeObjects = createHook(Store);

export const useUnsavedChangeObjects = createHook(Store, {
  selector: state => state.changeObjects.unsaved
});

export const useUnderRemovalChangeObjects = createHook(Store, {
  selector: state => state.changeObjects.underRemoval
});

export const MuutoksetContainer = createContainer(Store, {
  onInit: () => ({ setState }, initialState) => {
    setState(initialState);
  }
});
