import { findParent } from "./findParent";
import { uncheckSiblings } from "./uncheckSiblings";
import { modifyNode } from "./modifyNode";

/**
 * Activates the node's predecessors.
 * @param {object} node - Target node a.k.a clicked checbox / radio button.
 * @param {array} reducedStructure - Flatten array of all items on the form.
 * @param {array} changeObjects - Array of change objects.
 * @returns {array} - Updated array of change objects.
 */
export function activatePredecessors(node, reducedStructure, changeObjects) {
  /**
   * Let's find out if the node has a parent. The parent must be checked too
   * and if it exists its isIndeterminate property must be calculated. The
   * logic goes like this: If the parent has child nodes and NOT all of them
   * are checked then it's isIndeterminate property must be true. Let's find
   * the parent node first. Checking / activating is relevant only if the
   * parent is a checkbox or a radio button.
   */
  const parentNode = findParent(node, reducedStructure, [
    "CheckboxWithLabel",
    "RadioButtonWithLabel"
  ]);

  changeObjects = modifyNode(node, reducedStructure, changeObjects);

  if (parentNode) {
    if (parentNode.name === "RadioButtonWithLabel") {
      changeObjects = uncheckSiblings(
        parentNode,
        reducedStructure,
        changeObjects
      );
    }

    // The parent node might have a parent. Let's handle the parent node next.
    return activatePredecessors(parentNode, reducedStructure, changeObjects);
  }

  return changeObjects;
}
