import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import green from "@material-ui/core/colors/green";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Check from "@material-ui/icons/CheckBoxOutlined";
import isEqual from "react-fast-compare";

/**
 * @module Components/01-molecules
 */

/**
 * Label and checkbox united.
 * @example
 * const size = 12
 * const text = 'I am documented!'
 * return (
 *   <Documented size={size} text={text} />
 * )
 */
const CheckboxWithLabel = React.memo(
  ({
    forChangeObject,
    fullAnchor,
    children,
    id,
    isChecked,
    isDisabled,
    isIndeterminate,
    isPreviewModeOn,
    isReadOnly,
    labelStyles,
    onChanges
  }) => {
    const styles = makeStyles({
      root: {
        color: green[600],
        "&$checked": {
          color: green[500]
        }
      },
      label: labelStyles,
      checked: {} // This object must be empty for checked color to work.
    })();

    const handleChanges = useCallback(() => {
      onChanges(
        { forChangeObject, fullAnchor },
        {
          isChecked: !isChecked,
          isIndeterminate: isChecked ? true : false
        }
      );
    }, [forChangeObject, fullAnchor, isChecked, onChanges]);

    return (
      <React.Fragment>
        {!isReadOnly ? (
          <FormGroup row>
            <FormControlLabel
              classes={{
                label: styles.label
              }}
              disabled={isDisabled}
              control={
                <Checkbox
                  checked={isChecked}
                  id={id}
                  indeterminate={isChecked && isIndeterminate}
                  value="1"
                  onChange={handleChanges}
                  readOnly={isReadOnly}
                  classes={{
                    checked: styles.checked,
                    root: styles.root
                  }}
                />
              }
              label={children}
            />
          </FormGroup>
        ) : (
          isChecked && (
            <div className="flex flex-row text-base mb-2">
              {isPreviewModeOn ? (
                <ul className="list-disc leading-none">
                  <li>{children}</li>
                </ul>
              ) : (
                <React.Fragment>
                  <Check />
                  <span className="my-auto">{children}</span>
                </React.Fragment>
              )}
            </div>
          )
        )}
      </React.Fragment>
    );
  },
  (cp, np) => {
    return (
      isEqual(cp.forChangeObject, np.forChangeObject) &&
      isEqual(cp.fullAnchor, np.fullAnchor) &&
      cp.isChecked === np.isChecked &&
      cp.isDisabled === np.isDisabled &&
      cp.isIndeterminate === np.isIndeterminate &&
      cp.isPreviewModeOn === np.isPreviewModeOn &&
      cp.isReadOnly === np.isReadOnly &&
      isEqual(cp.children, np.children)
    );
  }
);

CheckboxWithLabel.defaultProps = {
  isChecked: false,
  isDisabled: false,
  isIndeterminate: false,
  isReadOnly: false
};

CheckboxWithLabel.propTypes = {
  children: PropTypes.object,
  forChangeObject: PropTypes.object,
  fullAnchor: PropTypes.string,
  id: PropTypes.string,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isIndeterminate: PropTypes.bool,
  isPreviewModeOn: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  /**
   * Will be called after checking or unchecking the checkbox.
   */
  onChanges: PropTypes.func.isRequired,
  /**
   * A parameter of the onChanges function.
   */
  labelStyles: PropTypes.object
};

CheckboxWithLabel.displayName = "CheckboxWithLabel";

export default CheckboxWithLabel;
