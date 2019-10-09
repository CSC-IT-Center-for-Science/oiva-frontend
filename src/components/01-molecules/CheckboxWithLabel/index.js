import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Checkbox from "@material-ui/core/Checkbox";
import green from "@material-ui/core/colors/green";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as R from "ramda";

/**
 * Label and checkbox united.
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
        {!props.isReadOnly || (props.isReadOnly && props.isChecked) ? (
          <FormGroup row>
            <FormControlLabel
              classes={{
                label: styles.label
              }}
              disabled={props.isDisabled || props.isReadOnly}
              control={
                <Checkbox
                  checked={props.isChecked}
                  value="1"
                  onChange={handleChanges}
                  classes={{
                    checked: styles.checked,
                    root: styles.root
                  }}
                />
              }
              label={props.children}
            />
          </FormGroup>
        ) : null}
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
