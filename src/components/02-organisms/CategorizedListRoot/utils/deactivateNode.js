import { append, reject, isNil } from "ramda";
import { findParent } from "./findParent";
import { updateChangeObjectsArray } from "./updateChangeObjectsArray";
import { getChangeObjByAnchor } from "../utils";
import { uncheckSiblings } from "./uncheckSiblings";

/**
 * Sets the isIndeterminate property of node's descendants as true.
 * @param {*} node - Includes an anchor and a properties object.
 * @param {*} reducedStructure - Flatten form structure.
 * @param {*} changeObjects - Array of change Objects.
 * @returns {array} - Updated array of change objects.
 */
export function deactivateNode(node, reducedStructure, changeObjects) {
  /**
   * Let's find out if the node has a parent.
   */
  const parentNode = findParent(node, reducedStructure, [
    "CheckboxWithLabel",
    "RadioButtonWithLabel"
  ]);

  // If parentNode exists and its type is either checkbox or radio button...
  if (parentNode && parentNode.formId === node.formId) {
    const parentChangeObj = getChangeObjByAnchor(
      parentNode.fullAnchor,
      changeObjects
    );

    if (!parentChangeObj && !node.properties.isIndeterminate) {
      changeObjects = append(
        {
          anchor: parentNode.fullAnchor,
          properties: reject(isNil)({
            metadata: parentNode.properties.forChangeObject,
            isChecked: true,
            isIndeterminate: true
          })
        },
        changeObjects
      );
    } else if (parentChangeObj && !parentChangeObj.properties.isIndeterminate) {
      changeObjects = updateChangeObjectsArray(
        parentNode,
        { isChecked: true, isIndeterminate: true },
        changeObjects
      );
    }

    // If the parent node is a radio button its siblings must be unchecked.
    if (parentNode.name === "RadioButtonWithLabel") {
      changeObjects = uncheckSiblings(
        parentNode,
        reducedStructure,
        changeObjects
      );
    }

    // The parent node might have a parent. Let's handle it parent node next.
    return deactivateNode(parentNode, reducedStructure, changeObjects);
  }

  return changeObjects;
}
