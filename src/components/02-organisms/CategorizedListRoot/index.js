import React, { useCallback, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import CategorizedList from "./CategorizedList";
import { handleNodeMain, getReducedStructure, getTargetNode } from "./utils";
import * as R from "ramda";

// Default values for some properties of the component.
const defaultProps = {
  anchor: "anchornamemissing",
  categories: [],
  changes: [null],
  showCategoryTitles: false,
  uncheckParentWithoutActiveChildNodes: false
};

/**
 * CategorizedListRoot is the entry point of form handling.
 */
const CategorizedListRoot = React.memo(
  ({
    anchor = defaultProps.anchor,
    categories = defaultProps.categories,
    changes = defaultProps.changes,
    onUpdate,
    showCategoryTitles = defaultProps.showCategoryTitles,
    isReadOnly,
    showValidationErrors,
    uncheckParentWithoutActiveChildNodes = defaultProps.uncheckParentWithoutActiveChildNodes
  }) => {
    const changesRef = useRef(null);

    changesRef.current = useMemo(() => {
      return changes;
    }, [changes]);

    /**
     * Categories (lomake) can be a multidimensional array. It's practical to
     * reduce the structure into a one dimensional array for use. The reduced
     * structure is used on defining the updated array of change objects.
     */
    const reducedStructure = useMemo(() => {
      const result = getReducedStructure(categories);
      return result;
    }, [categories]);

    /**
     * Function will be called when something changes on the form. The only
     * parameter is changeObj that contains the changed properties and maybe
     * some metadata too.
     */
    const onChangesUpdate = useCallback(
      changeObj => {
        // Target node is the component affected by the change.
        const targetNode = getTargetNode(changeObj, reducedStructure);
        // The array of change objects will be updated.
        const nextChanges = handleNodeMain(
          uncheckParentWithoutActiveChildNodes,
          targetNode,
          anchor,
          reducedStructure,
          changesRef.current
        );
        /**
         * The updated array will be sent using the onUpdate callback function.
         * The anchor parameter is the root anchor of the current form. It can
         * be used to bind and store the array of changes correctly.
         **/
        onUpdate({
          anchor,
          changes: nextChanges
        });
      },
      [anchor, onUpdate, reducedStructure, uncheckParentWithoutActiveChildNodes]
    );

    /**
     * Function skips the tree checking (onChangesUpdate func, handleNodeMain).
     * Tree checking might be needed on future use cases.
     */
    const removeChangeObject = useCallback(
      _anchor => {
        return onUpdate({
          anchor,
          changes: R.filter(
            R.compose(R.not, R.propEq("anchor", _anchor)),
            changes
          )
        });
      },
      [anchor, changes, onUpdate]
    );

    return (
      <React.Fragment>
        {/**
         * If the first change object is not null (default) the CategorizedList
         * will be created.
         **/
        !R.equals(R.head(changes), null)
          ? (() => {
              /**
               * This is the first instance of CategorizedList. The component
               * will create more instances on it's own.
               **/
              return (
                <CategorizedList
                  anchor={anchor}
                  categories={categories}
                  changes={changes}
                  rootPath={[]}
                  showCategoryTitles={showCategoryTitles}
                  onChangesUpdate={onChangesUpdate}
                  removeChangeObject={removeChangeObject}
                  isReadOnly={isReadOnly}
                  showValidationErrors={showValidationErrors}
                />
              );
            })()
          : null}
      </React.Fragment>
    );
  },
  (prevState, nextState) => {
    const areCategoriesSame =
      JSON.stringify(prevState.categories) ===
      JSON.stringify(nextState.categories);
    const areChangesSame = R.equals(prevState.changes, nextState.changes);
    return areCategoriesSame && areChangesSame;
  }
);

CategorizedListRoot.propTypes = {
  // Root anchor of the form. Dots are not allowed.
  anchor: PropTypes.string,
  // Structure of the form. Array of categories.
  categories: PropTypes.array,
  // Array of change objects.
  changes: PropTypes.array,
  // Callback function that will be called when something changes on the form.
  onUpdate: PropTypes.func.isRequired,
  // Categories might have titles. The boolean defines if are going to be shown.
  showCategoryTitles: PropTypes.bool,
  // Defines if the form can be modified.
  isReadOnly: PropTypes.bool,
  // Boolean for showing the validation errors.
  showValidationErrors: PropTypes.bool,
  // Node's predecessors will be unchecked if the node and its siblings are unchecked.
  uncheckParentWithoutActiveChildNodes: PropTypes.bool
};

export default CategorizedListRoot;
