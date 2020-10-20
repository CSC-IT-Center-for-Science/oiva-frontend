import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import green from "@material-ui/core/colors/green";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { isEqual } from "lodash";
import Check from "@material-ui/icons/CheckBoxOutlined";
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
    children,
    isChecked,
    isDisabled,
    isIndeterminate,
    isReadOnly,
    labelStyles,
    onChanges,
    payload
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
      onChanges(payload, {
        isChecked: !isChecked,
        isIndeterminate: isChecked ? true : false
      });
    }, [isChecked, onChanges, payload]);

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
              <Check />
              <span className="my-auto">{children}</span>
            </div>
          )
        )}
      </React.Fragment>
    );
  },
  (cp, np) => {
    return (
      cp.isChecked === np.isChecked &&
      cp.isDisabled === np.isDisabled &&
      cp.isIndeterminate === np.isIndeterminate &&
      cp.isReadOnly === np.isReadOnly &&
      isEqual(cp.payload, np.payload)
    );
  }
);

CheckboxWithLabel.defaultProps = {
  isChecked: false,
  isDisabled: false,
  isIndeterminate: false,
  isReadOnly: false,
  payload: {}
};

CheckboxWithLabel.propTypes = {
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isIndeterminate: PropTypes.bool,
  /**
   * Will be called after checking or unchecking the checkbox.
   */
  onChanges: PropTypes.func.isRequired,
  /**
   * A parameter of the onChanges function.
   */
  labelStyles: PropTypes.object,
  payload: PropTypes.object,
  isReadOnly: PropTypes.bool
};

export default CheckboxWithLabel;
