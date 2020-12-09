import { dropLast, equals, find, includes } from "ramda";

/**
 * Find the node's parent node.
 * @param {object} node - Includes an anchor and a properties object.
 * @param {array} reducedStructure - Flatten form structure.
 * @param {array} nodeNames - Array of node / component names.
 * @returns {object} - Parent node.
 */
export function findParent(node, reducedStructure, nodeNames = []) {
  return find(_node => {
    return (
      _node.level === node.level - 1 &&
      _node.columnIndex === 0 &&
      (nodeNames.length > 0 ? includes(_node.name, nodeNames) : true) &&
      equals(dropLast(1, _node.anchorParts), dropLast(2, node.anchorParts))
    );
  }, reducedStructure);
}
