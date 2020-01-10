import React from "react";
import PropTypes from "prop-types";
import * as R from "ramda";

/**
 * Grid component. Used by the Table component.
 * @param {object} props - Properties object.
 * @param {object} props.children - Content of the Grid.
 * @param {array} props.styleClasses - List of css class names.
 */
const Grid = ({ children, styleClasses = [] }) => {
  const classNames = R.join(" ", styleClasses);

  return (
    <div className={classNames} key={`key-${Math.random()}`} role="grid">
      {children}
    </div>
  );
};

Grid.propTypes = {
  styleClasses: PropTypes.array
};

export default Grid;
