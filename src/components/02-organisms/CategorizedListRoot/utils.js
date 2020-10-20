import * as R from "ramda";
import { activatePredecessors } from "./utils/activatePredecessors";
import { deactivateNodesPredecessors } from "./utils/deactivateNodesPredecessors";
import { activateNodeAndItsDescendants } from "./utils/activateNodeAndItsDescendants";
import { deactivateNodeAndItsDescendants } from "./utils/deactivateNodeAndItsDescendants";
import { removeAnchorPart } from "../../../utils/common";
import { removeDeprecatedChanges } from "./utils/removeDeprecatedChanges";
import { deactivateNode } from "./utils/deactivateNode";
import { findParent } from "./utils/findParent";

/**
 * @module CategorizedListRoot/utils
 **/

/**
 * Returns changes by level.
 *
 * @param {number} level
 * @param {array} changes
 */
export const getChangesByLevel = (level, changes) => {
  return changes.filter(change => {
    const categoryDepth = R.filter(v => {
      return v === "categories";
    }, change.path || []).length;
    return categoryDepth === level;
  });
};

export const findCategoryAnchor = (
  category,
  anchor,
  structure = [],
  level = 0,
  path = []
) => {
  if (category.components) {
    path = R.append("components", path);
    R.addIndex(R.forEach)((component, index) => {
      path = R.append(index, path);
      const fullAnchor = R.join(".", [anchor, component.anchor]);
      structure = R.append(
        {
          ...component,
          anchorParts: R.split(".", fullAnchor),
          formId: category.formId,
          fullAnchor,
          hasDescendants: category.categories && category.categories.length > 0,
          level,
          columnIndex: index,
          path
        },
        structure
      );
    }, category.components);
  }

  if (category.categories && category.categories.length) {
    path = R.append("categories", path);
    return R.map(_category => {
      return findCategoryAnchor(
        _category,
        R.join(".", [anchor, _category.anchor]),
        structure,
        level + 1,
        path
      );
    }, category.categories);
  }
  return structure;
};

export const getReducedStructure = categories => {
  return R.uniq(
    R.flatten(
      R.map(category => {
        return findCategoryAnchor(category, category.anchor);
      }, categories)
    )
  );
};

export const getTargetNode = (loopChange, reducedStructure) => {
  return {
    original: R.find(
      R.propEq("fullAnchor", R.prop("anchor", loopChange)),
      reducedStructure
    ),
    requestedChanges: loopChange ? loopChange.properties : {}
  };
};

export const getChangeObjIndexByAnchor = (anchor, changes) => {
  return R.findIndex(R.propEq("anchor", anchor), changes);
};

export const getChangeObjByAnchor = (anchor, changes) => {
  return R.find(R.propEq("anchor", anchor), changes);
};

const getPropertiesObject = (changeObj = {}, requestedChanges) => {
  return Object.assign({}, changeObj.properties || {}, requestedChanges);
};

export const getChangesForReadOnlyLomake = (
  reducedStructure,
  index = 0,
  changes = []
) => {
  const changeObj = {
    anchor: reducedStructure[index].fullAnchor,
    properties: { isReadOnly: true }
  };
  const targetNode = getTargetNode(changeObj, reducedStructure);
  const cumulativeChanges = handleNodeMain(
    targetNode,
    null,
    reducedStructure,
    changes
  );
  if (R.view(R.lensIndex(index + 1))(reducedStructure)) {
    return getChangesForReadOnlyLomake(
      reducedStructure,
      index + 1,
      cumulativeChanges
    );
  }
  return cumulativeChanges;
};

/**
 * Function handles the new changes of a form and returns an updated array of
 * change objects.
 * @param {object} nodeWithRequestedChanges - Target node and requested changes.
 * @param {object} nodeWithRequestedChanges.requestedChanges - Properties object.
 * @param {array} changes - Array of change objects.
 */
export const handleNodeMain = (
  uncheckParentWithoutActiveChildNodes = false,
  nodeWithRequestedChanges,
  rootAnchor,
  reducedStructure,
  changes = []
) => {
  /**
   * node = definition of a component that user has interacted with. Node
   * is an object that includes a name (e.g. CheckboxWithLabel) and the
   * properties defined on the current form.
   * E.g.
   *
   * {
   *   anchor: "A",
   *   name: "CheckboxWithLabel",
   *   properties: {
   *     code: "A.A.A",
   *     isChecked: false,
   *     labelStyles: {
   *       addition: { color: "purple" },
   *       removal: { color: "purple", textDecoration: "line-through" },
   *       custom: { fontWeight: 600 }
   *     },
   *     name: "example-checkbox",
   *     title: "Osaamisala 1",
   *     value: "Testi"
   *   },
   *   anchorParts: ["A", "A", "A"],
   *   fullAnchor: "A.A.A",
   *   level: 1,
   *   columnIndex: 0,
   *   path: ["components", 0, "categories", "components", 0]
   * };
   **/
  const node = R.prop("original", nodeWithRequestedChanges);

  // Requested changes. E.g. {"isChecked":true}
  const requestedChanges = R.prop("requestedChanges", nodeWithRequestedChanges);

  // First part of every anchor will be removed.
  let changeObjects = rootAnchor
    ? R.map(changeObj => {
        const reducedAnchor = removeAnchorPart(changeObj.anchor, 0);
        return R.assoc("anchor", reducedAnchor, changeObj);
      }, changes)
    : changes;

  if (requestedChanges.isChecked) {
    /**
     * If user has clicked an unchecked checkbox or a radio button we must do
     * two things:
     * 1) Activate the node and its descendants.
     */
    changeObjects = R.uniq(
      R.flatten(
        activateNodeAndItsDescendants(node, reducedStructure, changeObjects)
      )
    );
    // 2) Activate the node's predecessors.
    if (
      findParent(node, reducedStructure, [
        "CheckboxWithLabel",
        "RadioButtonWithLabel"
      ])
    ) {
      changeObjects = activatePredecessors(
        node,
        reducedStructure,
        changeObjects
      );
    }
  } else if (requestedChanges.isChecked === false) {
    /**
     * If user has clicked a checked checkbox or a radio button we must do
     * two things:
     * 1) Deactivate the node and its descendants.
     */
    changeObjects = deactivateNodeAndItsDescendants(
      node,
      reducedStructure,
      changeObjects
    );
    // 2) Deactivate the node's predecessors.
    if (uncheckParentWithoutActiveChildNodes) {
      changeObjects = deactivateNodesPredecessors(
        node,
        reducedStructure,
        changeObjects
      );
    } else {
      changeObjects = deactivateNode(node, reducedStructure, changeObjects);
    }
  } else {
    /**
     * Otherwise the properties of the new change object will be merged with
     * the properties of the earlier changes of the current node.
     **/

    const changeObj = getChangeObjByAnchor(node.fullAnchor, changeObjects);
    const propsObj = getPropertiesObject(changeObj, requestedChanges);
    const updatedChangeObj = { anchor: node.fullAnchor, properties: propsObj };

    if (changeObj) {
      /**
       * The earlier change object related to the node will be replaced with the
       * updated one.
       **/
      changeObjects = R.map(_changeObj => {
        if (R.equals(_changeObj.anchor, updatedChangeObj.anchor)) {
          return updatedChangeObj;
        }
        return _changeObj;
      }, changeObjects);
    } else {
      /**
       * If there wasn't an earlier change object then we add the freshly made
       * change object on to the array of change objects.
       **/
      changeObjects = R.append(updatedChangeObj, changeObjects);
    }
  }

  changeObjects = removeDeprecatedChanges(changeObjects);

  // Last thing is to prefix the anchors of change objects with the root anchor.
  const updatedChangesArr = rootAnchor
    ? R.map(changeObj => {
        return R.assoc(
          "anchor",
          `${rootAnchor}.${changeObj.anchor}`,
          changeObj
        );
      }, changeObjects)
    : changeObjects;

  // Updated array of change objects will be returned.
  return updatedChangesArr;
};
