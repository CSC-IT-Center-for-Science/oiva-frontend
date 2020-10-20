import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as R from "ramda";

const defaultProps = {
  styleClasses: ["text-base"]
};

const StatusTextRow = React.memo(
  ({
    code,
    isHidden,
    isRequired,
    labelStyles,
    layout,
    statusText,
    statusTextStyleClasses,
    styleClasses,
    isReadOnly,
    title
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
            <div className="flex">
              <div className="flex-1">
                {code ? <span className="pr-4">{code}</span> : null}
                <span>{title}</span>
                {!isReadOnly && isRequired && <span className="pr-4">*</span>}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <React.Fragment />;
    }
  },
  (cp, np) => {
    return (
      cp.isHidden === np.isHidden &&
      cp.isReadOnly === np.isReadOnly &&
      cp.isRequired === np.isRequired &&
      cp.statusText === np.statusText &&
      cp.code === np.code &&
      cp.title === np.title
    );
  }
);

StatusTextRow.propTypes = {
  code: PropTypes.string,
  isHidden: PropTypes.bool,
  isRequired: PropTypes.bool,
  labelStyles: PropTypes.object,
  layout: PropTypes.object,
  styleClasses: PropTypes.array,
  statusText: PropTypes.string,
  statusTextStyleClasses: PropTypes.array,
  isReadOnly: PropTypes.bool,
  title: PropTypes.string
};

export default StatusTextRow;
