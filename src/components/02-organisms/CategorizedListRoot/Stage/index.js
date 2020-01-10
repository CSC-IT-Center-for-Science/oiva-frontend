import React, { useCallback, useMemo, useState, useEffect } from "react";
import { handleNodeMain, getReducedStructure, getTargetNode } from "../utils";
import * as R from "ramda";
import PropTypes from "prop-types";

const Stage = props => {
  const [changes, setChanges] = useState(props.changes);
  const [nodeIndex, setNodeIndex] = useState(0);
  const [interval, setInterval] = useState();

  const handleUpdate = payload => {
    setChanges(payload.changes);
  };

  const reducedStructure = useMemo(() => {
    return getReducedStructure(props.categories);
  }, [props.categories]);

  const updateNodeIndex = useCallback(
    nodeIndex => {
      if (interval) {
        if (props.loopChanges[nodeIndex + 1]) {
          setNodeIndex(nodeIndex + 1);
        } else if (props.isLoopEnabled) {
          setNodeIndex(0);
        } else {
          console.info("Procedure ended.");
        }
      }
    },
    [interval, props.loopChanges]
  );

  const targetNode = useMemo(() => {
    let targetNode = null;
    if (interval) {
      const loopChange = R.view(R.lensIndex(nodeIndex))(props.loopChanges);
      targetNode = getTargetNode(loopChange, reducedStructure);
      console.group();
      console.info("Target node", targetNode);
      console.info("Reduced structure", reducedStructure);
      console.groupEnd();
    }
    return targetNode;
  }, [nodeIndex, interval, props.loopChanges, reducedStructure]);

  useEffect(() => {
    if (reducedStructure && targetNode) {
      const nextChanges = handleNodeMain(
        targetNode,
        props.anchor,
        reducedStructure,
        changes
      );
      if (!R.equals(changes, nextChanges)) {
        setChanges(nextChanges);
      }
    }
  }, [changes, props.anchor, reducedStructure, targetNode]);

  useEffect(() => {
    setInterval(props.interval);
  }, [props.interval]);

  return (
    <React.Fragment>
      {!!props.render
        ? props.render({
            anchor: props.anchor,
            categories: props.categories,
            changes,
            interval: R.isNil(interval) ? 2000 : interval,
            onUpdate: handleUpdate,
            updateNodeIndex,
            nodeIndex
          })
        : null}
      {/* {props.children} */}
      <div className="p-20">
        <button
          type="button"
          onClick={() => {
            setInterval(interval > 0 ? 0 : 1000);
          }}>
          {interval > 0 ? "Stop" : "Play"}
        </button>
        {targetNode && targetNode.original ? (
          <div>
            Target node:
            <span className="font-bold">
              {targetNode.original.fullAnchor}
            </span>{" "}
            <br />
            <span className="pr-4">Latest operations:</span>
            <code>{JSON.stringify(targetNode.requestedChanges)}</code>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
};

Stage.defaultProps = {
  isLoopEnabled: true,
  loopChanges: []
};

Stage.propTypes = {
  isLoopEnabled: PropTypes.bool,
  loopChanges: PropTypes.array
};

export default Stage;
