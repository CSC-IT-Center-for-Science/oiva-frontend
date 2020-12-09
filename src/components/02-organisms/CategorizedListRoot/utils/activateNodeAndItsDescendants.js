import { append, map, flatten, uniq, reject, isNil } from "ramda";
import { getChildNodes } from "./getChildNodes";
import { getChangeObjByAnchor } from "../utils";
import { uncheckSiblings } from "./uncheckSiblings";
import { updateChangeObjectsArray } from "./updateChangeObjectsArray";

function Checker() {
  return {
    run: (node, reducedStructure, changeObjects) => {
      return activateNodeAndItsDescendants(
        node,
        reducedStructure,
        changeObjects
      );
    }
  };
}

/**
 * Function activates the target node and updates the situation of
 * related nodes too.
 * @param {object} node - Target node a.k.a clicked checbox / radio button.
 * @param {array} reducedStructure - Flatten array of all items on the form.
 * @param {array} changeObjects - Array of change objects.
 * @returns {array} - Updated array of change objects.
 */
export function activateNodeAndItsDescendants(
  node,
  reducedStructure,
  changeObjects
) {
  const childNodes = node.hasDescendants
    ? getChildNodes(node, reducedStructure, ["CheckboxWithLabel"])
    : [];

  // We are not ready yet. Every checkbox child node must be checked.
  if (childNodes.length) {
    changeObjects = uniq(
      flatten(
        map(childNode => {
          const result = new Checker().run(
            childNode,
            reducedStructure,
            changeObjects
          );
          return result;
        }, childNodes)
      )
    );
  }

  // The first thing is to find out the change object of the target node.
  const changeObj = getChangeObjByAnchor(node.fullAnchor, changeObjects);

  if (changeObj) {
    if (
      node.properties.isChecked === true &&
      !node.properties.isIndeterminate
    ) {
      /**
       * If original isChecked value of the node is true we just have to
       * remove the change object.
       **/
      changeObjects = updateChangeObjectsArray(
        node,
        { isDeprecated: true },
        changeObjects
      );
    } else {
      /**
       * If the original value is not true and change object's isChecked
       * value is not true then the isChecked's value on change object must
       * be updated to be true.
       */
      changeObjects = updateChangeObjectsArray(
        node,
        { isChecked: true, isIndeterminate: false },
        changeObjects
      );
    }
  } else if (!changeObj && !node.properties.isChecked) {
    /**
     * If there's no change object and node's own isChecked property is false
     * we need to create a new change object with isChecked equals true.
     * The metadata given on the form will also be included to the change
     * object.
     */
    changeObjects = append(
      {
        anchor: node.fullAnchor,
        properties: reject(isNil)({
          metadata: node.properties.forChangeObject,
          isChecked: true
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
