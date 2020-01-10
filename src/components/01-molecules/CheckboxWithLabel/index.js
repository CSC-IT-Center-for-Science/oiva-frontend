import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Checkbox from "@material-ui/core/Checkbox";
import green from "@material-ui/core/colors/green";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as R from "ramda";
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
  props => {
    const styles = makeStyles({
      root: {
        color: green[600],
        "&$checked": {
          color: green[500]
        }
      },
      label: props.labelStyles,
      checked: {} // This object must be empty for checked color to work.
    })();

    const handleChanges = () => {
      props.onChanges(props.payload, { isChecked: !props.isChecked });
    };

    return (
      <React.Fragment>
        {!props.isReadOnly ? (
          <FormGroup row>
            <FormControlLabel
              classes={{
                label: styles.label
              }}
              disabled={props.isDisabled}
              control={
                <Checkbox
                  checked={props.isChecked}
                  value="1"
                  onChange={handleChanges}
                  readOnly={props.isReadOnly}
                  classes={{
                    checked: styles.checked,
                    root: styles.root
                  }}
                />
              }
              label={props.children}
            />
          </FormGroup>
        ) : (
          props.isChecked && (
            <div className="flex flex-row text-base mb-2">
              <Check />
              <span className="my-auto">{props.children}</span>
            </div>
          )
        )}
      </React.Fragment>
    );
  },
  (prevState, currentState) => {
    return (
      R.equals(prevState.payload, currentState.payload) &&
      R.equals(prevState.isChecked, currentState.isChecked) &&
      R.equals(prevState.isDisabled, currentState.isDisabled)
    );
  }
);

CheckboxWithLabel.defaultProps = {
  isChecked: false,
  isDisabled: false,
  isReadOnly: false,
  payload: {}
};

CheckboxWithLabel.propTypes = {
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
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
