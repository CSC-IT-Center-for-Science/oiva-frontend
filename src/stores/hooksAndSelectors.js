import {
  concat,
  difference,
  flatten,
  groupBy,
  isNil,
  map,
  mergeAll,
  path,
  pipe,
  prepend,
  prop,
  reject,
  split,
  values
} from "ramda";
import { getLatestChangesByAnchor } from "utils/common";

const getChangeObjectsByKeyAndAnchor = (key, anchor, changeObjects = {}) => {
  return path(prepend(key, split("_", anchor)), changeObjects) || [];
};

export const getAllChangeObjectsByKeyAnchor = (state, { anchor }) => {
  const { changeObjects } = state;
  return {
    saved: getChangeObjectsByKeyAndAnchor("saved", anchor, changeObjects),
    underRemoval: getChangeObjectsByKeyAndAnchor(
      "underRemoval",
      anchor,
      changeObjects
    ),
    unsaved: getChangeObjectsByKeyAndAnchor("unsaved", anchor, changeObjects)
  };
};

export const getChangeObjectsByAnchorWithoutUnderRemoval = (
  state,
  { anchor }
) => {
  const { changeObjects } = state;
  const saved = reject(
    isNil,
    flatten(
      values(getChangeObjectsByKeyAndAnchor("saved", anchor, changeObjects))
    )
  );
  const underRemoval = reject(
    isNil,
    flatten(
      values(
        getChangeObjectsByKeyAndAnchor("underRemoval", anchor, changeObjects)
      )
    )
  );
  const unsaved = reject(
    isNil,
    flatten(
      values(getChangeObjectsByKeyAndAnchor("unsaved", anchor, changeObjects))
    )
  );
  const mergedChanges = pipe(
    groupBy(prop("anchor")),
    values,
    map(groupedChanges => mergeAll(groupedChanges))
  )(concat(saved, unsaved));
  return difference(mergedChanges, underRemoval);
};

export const getLatestChangesByAnchorByKey = (state, { anchor }) => {
  const { latestChanges } = state;
  return {
    underRemoval: getLatestChangesByAnchor(anchor, latestChanges.underRemoval),
    unsaved: getLatestChangesByAnchor(anchor, latestChanges.unsaved)
  };
};
