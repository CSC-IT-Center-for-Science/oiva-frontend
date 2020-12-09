import { filter } from "ramda";
import { isNodeChecked } from "./isNodeChecked";
import { getChildNodes } from "./getChildNodes";

export function getCheckedChildNodes(
  node,
  reducedStructure,
  changeObjects = []
) {
  const childNodes = getChildNodes(node, reducedStructure);
  return filter(childNode => {
    return isNodeChecked(childNode, changeObjects);
  }, childNodes);
}
