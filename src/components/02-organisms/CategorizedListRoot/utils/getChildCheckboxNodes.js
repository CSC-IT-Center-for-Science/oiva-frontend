import { getChildNodes } from "./getChildNodes";

/**
 * Returns all checkbox child nodes of the node.
 * @param {object} node - Includes an anchor and a properties object.
 * @param {array} reducedStructure - Flatten structure of a form.
 * @returns {array} - Array of child nodes of type CheckboxWithLabel.
 */
export function getChildCheckboxNodes(node, reducedStructure) {
  return getChildNodes(node, reducedStructure, ["CheckboxWithLabel"]);
}
