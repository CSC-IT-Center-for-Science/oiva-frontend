import { getChangeObjByAnchor } from "../utils";

/**
 * Finds out if the given node is checked either by default or by
 * a change object.
 * @param {object} node - Includes an anchor and a properties object.
 * @param {array} changeObjects - Array of change objects.
 * @returns {bool} - Boolean tells if the given node is checked.
 */
export function isNodeChecked(node, changeObjects) {
  const changeObj = getChangeObjByAnchor(node.fullAnchor, changeObjects);
  return !changeObj
    ? node.properties.isChecked
    : changeObj.properties.isChecked && !changeObj.properties.isDeprecated;
}
