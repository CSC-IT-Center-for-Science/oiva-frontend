import React from "react";
import PropTypes from "prop-types";
import * as R from "ramda";

/**
 * RowGroup component. Used by the Table component.
 * @param {object} props - Properties object.
 * @param {object} props.children - RowGroup content.
 * @param {array} props.styleClasses - List of css class names.
 */
const RowGroup = ({ children, styleClasses = [], tableLevel = 0 }) => {
  const allStyleClasses = R.concat(styleClasses, [`pl-${4 * tableLevel}`]);
  const classNames = R.join(" ", allStyleClasses);

  return (
    <div className={classNames} key={`key-${Math.random()}`} role="rowgroup">
      {children}
    </div>
  );
};

RowGroup.propTypes = {
  styleClasses: PropTypes.array
};

export default RowGroup;
