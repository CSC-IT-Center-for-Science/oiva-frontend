import { append, flatten, map, uniq, reject, isNil } from "ramda";
import { getChildNodes } from "./getChildNodes";
import { getChangeObjByAnchor } from "../utils";
import { uncheckSiblings } from "./uncheckSiblings";
import { updateChangeObjectsArray } from "./updateChangeObjectsArray";
import { isNodeChecked } from "./isNodeChecked";

/**
 * Function deactivates the target node and its descendants.
 * @param {object} node - Target node a.k.a clicked checbox / radio button.
 * @param {array} reducedStructure - Flatten array of all items on the form.
 * @param {array} changeObjects - Array of change objects.
 * @returns {array} - Updated array of change objects.
 */
export function deactivateNodeAndItsDescendants(
  node,
  reducedStructure,
  changeObjects
) {
  if (!isNodeChecked(node, changeObjects)) {
    return changeObjects;
  }

  const childNodes = node.hasDescendants
    ? getChildNodes(node, reducedStructure, [
        "CheckboxWithLabel",
        "RadioButtonWithLabel"
      ])
    : [];

  // We are not ready yet. Every checkbox child node must be checked.
  if (childNodes.length) {
    changeObjects = uniq(
      flatten(
        map(childNode => {
          return deactivateNodeAndItsDescendants(
            childNode,
            reducedStructure,
            changeObjects
          );
        }, childNodes)
      )
    );
  }

  // The first thing is to find out the change object of the target node.
  const changeObj = getChangeObjByAnchor(node.fullAnchor, changeObjects);

  if (changeObj) {
    if (!node.properties.isChecked) {
      /**
       * If the node's original isChecked value is falsy we just need
       * to get rid of the change object.
       **/
      changeObjects = updateChangeObjectsArray(
        node,
        { isDeprecated: true },
        changeObjects
      );
    } else {
      // Otherwise the change object have to be re-configured.
      changeObjects = updateChangeObjectsArray(
        node,
        { isChecked: false, isIndeterminate: false },
        changeObjects
      );
    }
  } else if (!changeObj && node.properties.isChecked) {
    /**
     * If change object doesn't exist we need to create one. The metadata given
     * on the form will also be included in the change object.
     */
    changeObjects = append(
      {
        anchor: node.fullAnchor,
        properties: reject(isNil)({
          metadata: node.properties.forChangeObject,
          isChecked: false,
          isIndeterminate: false
        })
      },
      changeObjects
    );
  }

  // If the target node is a radio button its siblings must be unchecked.
  if (node.name === "RadioButtonWithLabel") {
    changeObjects = uncheckSiblings(node, reducedStructure, changeObjects);
  }

  return changeObjects;
}
