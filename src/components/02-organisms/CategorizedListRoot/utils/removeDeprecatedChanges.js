import { filter, includes, map, pathEq, uniq } from "ramda";

/**
 * Removes deprecated change objects from the array of change objects.
 * @param {array} changeObjects - Array of change objects.
 * @returns {array} - Updated array of change objects.
 */
export function removeDeprecatedChanges(changeObjects) {
  const isDeprecated = pathEq(["properties", "isDeprecated"], true);
  const deprecatedAnchors = map(changeObj => {
    return isDeprecated(changeObj) ? changeObj.anchor : null;
  }, changeObjects).filter(Boolean);
  const allButDeprecated = uniq(
    filter(changeObj => {
      return !includes(changeObj.anchor, deprecatedAnchors);
    }, changeObjects)
  );
  return allButDeprecated;
}
