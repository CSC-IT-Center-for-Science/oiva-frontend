import React, { useCallback, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import CategorizedList from "./CategorizedList";
import { handleNodeMain, getReducedStructure, getTargetNode } from "./utils";
import * as R from "ramda";

const defaultProps = {
  anchor: "anchornamemissing",
  categories: [],
  changes: [null],
  debug: false,
  interval: 0,
  sectionId: "sectionidmissing",
  showCategoryTitles: false,
  nodeIndex: 0
};

const CategorizedListRoot = React.memo(
  ({
    anchor = defaultProps.anchor,
    categories = defaultProps.categories,
    changes = defaultProps.changes,
    debug = defaultProps.debug,
    interval = defaultProps.interval,
    onUpdate,
    showCategoryTitles = defaultProps.showCategoryTitles,
    nodeIndex = defaultProps.nodeIndex,
    updateNodeIndex,
    isReadOnly
  }) => {
    const changesRef = useRef(null);

    changesRef.current = useMemo(() => {
      return changes;
    }, [changes]);

    const reducedStructure = useMemo(() => {
      return getReducedStructure(categories);
    }, [categories]);

    const onChangesUpdate = useCallback(
      changeObj => {
        const targetNode = getTargetNode(changeObj, reducedStructure);
        const nextChanges = handleNodeMain(
          targetNode,
          anchor,
          reducedStructure,
          changesRef.current
        );
        onUpdate({
          anchor: anchor,
          changes: nextChanges
        });
      },
      [anchor, onUpdate, reducedStructure]
    );

    useEffect(() => {
      if (interval && interval > 0) {
        const handle = setTimeout(() => {
          updateNodeIndex(nodeIndex);
        }, interval);
        return () => {
          clearTimeout(handle);
        };
      }
    }, [interval, nodeIndex, updateNodeIndex]);

    return (
      <React.Fragment>
        {!R.equals(R.head(changes), null)
          ? (() => {
              return (
                <CategorizedList
                  anchor={anchor}
                  categories={categories}
                  changes={changes}
                  rootPath={[]}
                  showCategoryTitles={showCategoryTitles}
                  onChangesUpdate={onChangesUpdate}
                  isReadOnly={isReadOnly}
                />
              );
            })()
          : null}
      </React.Fragment>
    );
  }
);

CategorizedListRoot.propTypes = {
  anchor: PropTypes.string,
  categories: PropTypes.array,
  changes: PropTypes.array,
  index: PropTypes.number,
  onUpdate: PropTypes.func.isRequired,
  sectionId: PropTypes.string,
  showCategoryTitles: PropTypes.bool,
  debug: PropTypes.bool,
  isReadOnly: PropTypes.bool
};

export default CategorizedListRoot;
