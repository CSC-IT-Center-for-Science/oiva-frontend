import { getChildNodes } from "./getChildNodes";
import { isEveryChildNodeChecked } from "./isEveryChildNodeChecked";
import { updateChangeObjectsArray } from "./updateChangeObjectsArray";
import { filter } from "ramda";

export function modifyNode(node, reducedStructure, changeObjects) {
  const childNodes = getChildNodes(node, reducedStructure);

  let isIndeterminate = !childNodes.length
    ? node.properties.isIndeterminate
    : !isEveryChildNodeChecked(node, reducedStructure, changeObjects);

  if (
    !node.properties.isChecked ||
    node.properties.isIndeterminate !== isIndeterminate
  ) {
    changeObjects = updateChangeObjectsArray(
      node,
      { isChecked: true, isIndeterminate: isIndeterminate },
      changeObjects
    );
  } else {
    changeObjects = filter(
      changeObj => changeObj.anchor !== node.fullAnchor,
      changeObjects
    );
  }

  return changeObjects;
}
