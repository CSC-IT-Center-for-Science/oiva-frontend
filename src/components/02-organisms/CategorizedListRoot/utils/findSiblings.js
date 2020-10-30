import { dropLast, equals, filter } from "ramda";

/**
 * Finds the siblings of the node.
 * @param {*} node - Includes an anchor and a properties object.
 * @param {*} reducedStructure - Flatten form structure.
 * @returns {array} - Sibling nodes.
 */
export function findSiblings(node, reducedStructure) {
  const parentAnchorPartsInit = dropLast(2, node.anchorParts);

  return filter(siblingCandidate => {
    return (
      equals(
        parentAnchorPartsInit,
        dropLast(2, siblingCandidate.anchorParts)
      ) &&
      equals(node.anchorParts.length, siblingCandidate.anchorParts.length) &&
      node.fullAnchor !== siblingCandidate.fullAnchor
    );
  }, reducedStructure);
}
