import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as R from "ramda";

const defaultProps = {
  styleClasses: ["text-base", "py-2"]
};

const StatusTextRow = React.memo(
  ({
    children,
    labelStyles,
    statusText,
    statusTextStyleClasses,
    styleClasses
  }) => {
    const [classNames, setClassNames] = useState(defaultProps.styleClasses);

    useEffect(() => {
      if (styleClasses && styleClasses.length) {
        setClassNames(styleClasses);
      }
    }, [styleClasses]);

    return (
      <div className={R.join(" ", classNames)} style={labelStyles}>
        <div className="flex">
          {statusText && (
            <div
              className={R.join(" ", statusTextStyleClasses)}
              // style={{ transform: "rotate(-50deg)" }}
            >
              {statusText}
            </div>
          )}
          {children}
        </div>
      </div>
    );
  }
);

StatusTextRow.propTypes = {
  labelStyles: PropTypes.object,
  styleClasses: PropTypes.array,
  statusText: PropTypes.string,
  statusTextStyleClasses: PropTypes.array
};

export default StatusTextRow;
