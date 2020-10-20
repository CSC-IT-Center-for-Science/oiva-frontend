import { filter } from "ramda";
import { isNodeChecked } from "./isNodeChecked";

/**
 * Returns true if every node is unchecked.
 * @param {object} node - Target node.
 * @param {array} changeObjects - Array of change objects.
 */
export function isEveryNodeUnchecked(nodes = [], changeObjects = []) {
  const checkedNodes = filter(childNode => {
    return isNodeChecked(childNode, changeObjects);
  }, nodes);
  return checkedNodes.length === 0;
}
