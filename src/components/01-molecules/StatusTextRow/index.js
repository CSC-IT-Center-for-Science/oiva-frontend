import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as R from "ramda";

const defaultProps = {
  styleClasses: ["text-base"]
};

const StatusTextRow = React.memo(
  ({
    children,
    labelStyles,
    layout,
    statusText,
    statusTextStyleClasses,
    styleClasses,
    isHidden
  }) => {
    const [classNames, setClassNames] = useState(defaultProps.styleClasses);

    useEffect(() => {
      if (styleClasses && styleClasses.length) {
        setClassNames(styleClasses);
      }
    }, [styleClasses]);

    useEffect(() => {
      const paddingClass = layout && layout.dense ? "pt-2" : "py-2";
      setClassNames(prevValue => {
        return R.append(paddingClass, prevValue);
      });
    }, [layout]);

    if (!isHidden) {
      return (
        <div className={R.join(" ", classNames)} style={labelStyles}>
          <div className="flex">
            {statusText && (
              <div className={R.join(" ", statusTextStyleClasses)}>
                {statusText}
              </div>
            )}
            {children}
          </div>
        </div>
      );
    }
  }
);

StatusTextRow.propTypes = {
  labelStyles: PropTypes.object,
  layout: PropTypes.object,
  styleClasses: PropTypes.array,
  statusText: PropTypes.string,
  statusTextStyleClasses: PropTypes.array,
  isHidden: PropTypes.bool
};

export default StatusTextRow;
