import { assocPath, find, forEach, isNil, map, propEq } from "ramda";

/**
 * Function calculates the final data object (for backend's needs).
 * @param {array} mapping - Array of configuration objects.
 * @param {array} changeObjects - Array of change objects
 */
export function calculateValues(mapping, changeObjects) {
  let result = {};
  forEach(item => {
    const changeObjectsSubGroup = map(anchor => {
      return find(propEq("anchor", anchor), changeObjects);
    }, item.anchors);
    const value = item.valueFn(changeObjectsSubGroup);
    if (!isNil(value)) {
      result = assocPath(item.path, value, result);
    }
  }, mapping || []);
  return result;
}

/**
 * Function calculates the final data object (for backend's needs) as an Array.
 * @param {array} mapping - Array of configuration objects.
 * @param {array} changeObjects - Array of change objects
 */
export function calculateValuesAsArray(mapping, changeObjects) {
  let result = [];
  forEach(item => {
    const changeObjectsSubGroup = map(anchor => {
      return find(propEq("anchor", anchor), changeObjects);
    }, item.anchors);
    const value = item.valueFn(changeObjectsSubGroup);
    if (!isNil(value)) {
      result.push({ value: value });
    }
  }, mapping || []);
  return result;
}
