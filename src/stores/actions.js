import {
  assoc,
  assocPath,
  compose,
  difference,
  filter,
  head,
  map,
  not,
  path,
  prepend,
  propEq,
  split
} from "ramda";
import { getAnchorPart, recursiveTreeShake } from "utils/common";

const removeUnderRemoval = () => ({ getState, setState }) => {
  const currentState = getState();
  const nextChangeObjects = assoc(
    "underRemoval",
    {},
    currentState.changeObjects
  );
  setState(assoc("changeObjects", nextChangeObjects, currentState));
};

const removeUnsavedChanges = () => ({ getState, setState }) => {
  const currentState = getState();
  const nextChangeObjects = assoc("unsaved", {}, currentState.changeObjects);
  setState(assoc("changeObjects", nextChangeObjects, currentState));
};

const setLatestChanges = changeObjects => ({ getState, setState }) => {
  setState(assoc("latestChanges", changeObjects, getState()));
};

const setSavedChanges = (changeObjects, anchor) => ({ getState, setState }) => {
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
    setState(nextState);
  }
};

export const initializeChanges = changeObjects => ({ dispatch }) => {
  dispatch(setSavedChanges(changeObjects));
  dispatch(setLatestChanges({}));
  dispatch(removeUnderRemoval());
  dispatch(removeUnsavedChanges());
};

export const removeChangeObjectByAnchor = anchor => ({
  getState,
  setState
}) => {
  const allCurrentChangeObjects = getState().changeObjects;
  const anchorParts = split("_", getAnchorPart(anchor, 0));
  const unsavedFullPath = prepend("unsaved", anchorParts);
  const changeObjects = path(unsavedFullPath, allCurrentChangeObjects);
  if (changeObjects) {
    let nextChangeObjects = assocPath(
      unsavedFullPath,
      filter(compose(not, propEq("anchor", anchor)), changeObjects),
      getState().changeObjects
    );
    nextChangeObjects = recursiveTreeShake(unsavedFullPath, nextChangeObjects);
    setState(assoc("changeObjects", nextChangeObjects, getState()));
  }
};

export const setChanges = (changeObjects, anchor = "") => ({
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
  const unsavedChangeObjects = difference(changeObjects, savedByAnchor);
  const savedChangeObjects = difference(savedByAnchor, changeObjects);

  /**
   * Etsitään ankkuria käyttäen vastaavat underRemoval-tilassa olevat
   * muutokset.
   */
  const underRemovalByAnchor =
    path(underRemovalFullPath, getState().changeObjects) || [];

  /**
   * Etsitään löydetyistä muutosobjekteista ne, joita vastaavia muutos-
   * objekteja ollaan tallentamassa.
   */
  const freshNewChangeObjects = difference(
    unsavedChangeObjects,
    underRemovalByAnchor
  );

  let nextChangeObjects = assocPath(
    unsavedFullPath,
    freshNewChangeObjects,
    currentChangeObjects
  );

  nextChangeObjects = assocPath(
    underRemovalFullPath,
    savedChangeObjects,
    nextChangeObjects
  );

  /**
   * Ravistetaan muutosten puusta tyhjät objektit pois.
   **/
  nextChangeObjects = recursiveTreeShake(
    unsavedFullPath,
    nextChangeObjects,
    dispatch
  );
  nextChangeObjects = recursiveTreeShake(
    underRemovalFullPath,
    nextChangeObjects,
    dispatch
  );

  const focusWhenDeleted = head(
    map(changeObj => {
      const anchor = path(
        ["properties", "metadata", "focusWhenDeleted"],
        changeObj
      );
      return changeObj.properties.deleteElement && anchor ? anchor : null;
    }, changeObjects).filter(Boolean)
  );

  if (focusWhenDeleted) {
    dispatch(setFocusOn(focusWhenDeleted));
  }

  dispatch(
    setLatestChanges({
      underRemoval: savedChangeObjects,
      unsaved: freshNewChangeObjects
    })
  );
  setState(assoc("changeObjects", nextChangeObjects, getState()));
};

export const setFocusOn = anchor => ({ getState, setState }) => {
  setState(assoc("focusOn", anchor, getState()));
};

export const setPreviewMode = value => ({ getState, setState }) => {
  setState(assoc("isPreviewModeOn", value, getState()));
};
