import * as R from "ramda";

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
    path = R.insert(-1, "components", path);
    R.addIndex(R.forEach)((component, index) => {
      path = R.insert(-1, index, path);
      const fullAnchor = R.join(".", [anchor, component.anchor]);
      structure = R.insert(
        -1,
        {
          ...component,
          anchorParts: R.split(".", fullAnchor),
          fullAnchor,
          level,
          columnIndex: index,
          path
        },
        structure
      );
    }, category.components);
  }

  if (category.categories && category.categories.length) {
    path = R.insert(-1, "categories", path);
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

const findParent = (node, reducedStructure) => {
  const parentNode = R.find(_node => {
    return (
      _node.level === node.level - 1 &&
      _node.columnIndex === 0 &&
      R.equals(
        R.dropLast(1, _node.anchorParts),
        R.dropLast(2, node.anchorParts)
      )
    );
  }, reducedStructure);
  return parentNode;
};

const findSiblings = (node, reducedStructure) => {
  const component = R.find(
    R.propEq("fullAnchor", node.fullAnchor),
    reducedStructure
  );
  let siblings = R.filter(_component => {
    const isSibling = !R.equals(node.fullAnchor, _component.fullAnchor);
    return isSibling && R.equals(component.level, _component.level);
  }, reducedStructure);
  if (component.level > 0) {
    siblings = R.filter(component => {
      const isAnchorLengthEqual = R.equals(
        R.prop("anchorParts", component).length,
        node.anchorParts.length
      );
      const isFirstPartOfAnchorEqual = R.compose(
        R.equals(R.head(node.anchorParts)),
        R.head,
        R.split("."),
        R.prop("fullAnchor")
      )(component);
      const isSibling = !R.equals(node.fullAnchor, component.fullAnchor);

      return isAnchorLengthEqual && isFirstPartOfAnchorEqual && isSibling;
    }, reducedStructure);
  }
  return siblings;
};

const getChangeObjByAnchor = (anchor, changes) => {
  return R.find(R.propEq("anchor", anchor), changes);
};

const disableNodes = (nodes, reducedStructure, changes, index = 0) => {
  const node = R.view(R.lensIndex(index))(nodes);
  const categoryAnchor = R.dropLast(1, node.anchorParts);
  const childNodes = R.filter(_node => {
    return R.equals(R.dropLast(2, _node.anchorParts), categoryAnchor);
  }, reducedStructure);
  const changeObj = getChangeObjByAnchor(node.fullAnchor, changes);
  if (changeObj) {
    if (changeObj.properties.isChecked) {
      changes = R.filter(R.compose(R.not, R.propEq("anchor")(node.fullAnchor)))(
        changes
      );
    }
  } else if (node.properties.isChecked) {
    changes = R.insert(
      -1,
      {
        anchor: node.fullAnchor,
        properties: {
          metadata: node.properties.forChangeObject,
          isChecked: false
        }
      },
      changes
    );
  }

  if (childNodes.length) {
    changes = disableNodes(childNodes, reducedStructure, changes);
  }

  if (index < nodes.length - 1) {
    return disableNodes(nodes, reducedStructure, changes, index + 1);
  }
  return changes;
};

export const checkLeafNode = (node, changes) => {
  const changeObj = getChangeObjByAnchor(node.fullAnchor, changes);
  if (changeObj && !changeObj.properties.isChecked) {
    changes = R.filter(R.compose(R.not, R.propEq("anchor")(node.fullAnchor)))(
      changes
    );
  } else if (!changeObj && !node.properties.isChecked) {
    changes = R.insert(
      -1,
      {
        anchor: node.fullAnchor,
        properties: {
          metadata: node.properties.forChangeObject,
          isChecked: true
        }
      },
      changes
    );
  }
  return changes;
};

export const checkNode = (node, reducedStructure, changes) => {
  changes = checkLeafNode(node, changes);
  const parentNode = findParent(node, reducedStructure);
  if (parentNode) {
    if (parentNode.name === "RadioButtonWithLabel") {
      changes = disableSiblings(node, reducedStructure, changes);
    }
    changes = checkNode(parentNode, reducedStructure, changes);
  }
  if (node.name === "RadioButtonWithLabel") {
    return disableSiblings(node, reducedStructure, changes);
  }
  return changes;
};

const disableSiblings = (node, reducedStructure, changes) => {
  const radioSiblings = R.filter(
    R.and(
      R.propEq("columnIndex", node.columnIndex),
      R.propEq("name", "RadioButtonWithLabel")
    )
  )(findSiblings(node, reducedStructure));
  if (radioSiblings.length) {
    return disableNodes(radioSiblings, reducedStructure, changes);
  }
  return changes;
};

const runActivationProcedure = (
  node,
  reducedStructure,
  changesWithoutRootAnchor
) => {
  const changeObj = getChangeObjByAnchor(
    node.fullAnchor,
    changesWithoutRootAnchor
  );
  if (changeObj && !changeObj.properties.isChecked) {
    changesWithoutRootAnchor = R.filter(
      R.compose(R.not, R.propEq("anchor")(node.fullAnchor))
    )(changesWithoutRootAnchor);
  } else if (!changeObj && !node.properties.isChecked) {
    changesWithoutRootAnchor = R.insert(
      -1,
      {
        anchor: node.fullAnchor,
        properties: {
          metadata: node.properties.forChangeObject,
          isChecked: true
        }
      },
      changesWithoutRootAnchor
    );
  }

  if (node.name === "RadioButtonWithLabel") {
    changesWithoutRootAnchor = disableSiblings(
      node,
      reducedStructure,
      changesWithoutRootAnchor
    );
  }

  const parentNode = findParent(node, reducedStructure);

  if (
    parentNode &&
    (parentNode.name === "CheckboxWithLabel" ||
      parentNode.name === "RadioButtonWithLabel")
  ) {
    changesWithoutRootAnchor = checkNode(
      parentNode,
      reducedStructure,
      changesWithoutRootAnchor
    );
  }
  return changesWithoutRootAnchor;
};

const runDeactivationProcedure = (
  node,
  reducedStructure,
  changesWithoutRootAnchor
) => {
  const changeObj = getChangeObjByAnchor(
    node.fullAnchor,
    changesWithoutRootAnchor
  );
  if (changeObj && changeObj.properties.isChecked === true) {
    changesWithoutRootAnchor = R.filter(
      R.compose(R.not, R.propEq("anchor")(node.fullAnchor))
    )(changesWithoutRootAnchor);
  } else if (!changeObj && node.properties.isChecked === true) {
    changesWithoutRootAnchor = R.insert(
      -1,
      {
        anchor: node.fullAnchor,
        properties: {
          metadata: node.properties.forChangeObject,
          isChecked: false
        }
      },
      changesWithoutRootAnchor
    );
  }
  const categoryAnchor = R.dropLast(1, node.anchorParts);
  const childNodes = R.filter(_node => {
    return R.equals(R.dropLast(2, _node.anchorParts), categoryAnchor);
  }, reducedStructure);
  if (childNodes.length) {
    return disableNodes(childNodes, reducedStructure, changesWithoutRootAnchor);
  }
  return changesWithoutRootAnchor;
};

const getPropertiesObject = (changeObj = {}, requestedChanges) => {
  return Object.assign({}, changeObj.properties || {}, requestedChanges);
};

/**
 * Main function. This will be run when a user enables a radio button.
 *
 * @param {object} nodeWithRequestedChanges
 * @param {object} nodeWithRequestedChanges.requestedChanges - Property object.
 * @param {array} changes - Array of change objects.
 */
export const handleNodeMain = (
  nodeWithRequestedChanges,
  rootAnchor,
  reducedStructure,
  changes = []
) => {
  // console.info(nodeWithRequestedChanges, rootAnchor, reducedStructure, changes);
  const node = R.prop("original", nodeWithRequestedChanges);
  const requestedChanges = R.prop("requestedChanges", nodeWithRequestedChanges);
  let changesWithoutRootAnchor = rootAnchor
    ? R.map(changeObj => {
        return R.assoc(
          "anchor",
          R.compose(
            R.join("."),
            R.tail(),
            R.split("."),
            R.prop("anchor")
          )(changeObj),
          changeObj
        );
      }, changes)
    : changes;

  if (requestedChanges.isChecked) {
    changesWithoutRootAnchor = runActivationProcedure(
      node,
      reducedStructure,
      changesWithoutRootAnchor
    );
  } else if (requestedChanges.isChecked === false) {
    changesWithoutRootAnchor = runDeactivationProcedure(
      node,
      reducedStructure,
      changesWithoutRootAnchor
    );
  } else {
    const changeObj = getChangeObjByAnchor(
      node.fullAnchor,
      changesWithoutRootAnchor
    );
    const propsObj = getPropertiesObject(changeObj, requestedChanges);
    const updatedChangeObj = { anchor: node.fullAnchor, properties: propsObj };
    if (changeObj) {
      changesWithoutRootAnchor = R.map(_changeObj => {
        if (R.equals(_changeObj.anchor, updatedChangeObj.anchor)) {
          return updatedChangeObj;
        }
        return _changeObj;
      }, changesWithoutRootAnchor);
    } else {
      changesWithoutRootAnchor = R.insert(
        -1,
        updatedChangeObj,
        changesWithoutRootAnchor
      );
    }
  }

  const updatedChangesArr = rootAnchor
    ? R.map(changeObj => {
        return R.assoc(
          "anchor",
          `${rootAnchor}.${changeObj.anchor}`,
          changeObj
        );
      }, changesWithoutRootAnchor)
    : changesWithoutRootAnchor;
  return updatedChangesArr;
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
