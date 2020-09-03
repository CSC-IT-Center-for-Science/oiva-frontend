import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import Tooltip from "../../02-organisms/Tooltip";
import { isEmpty } from "ramda";
import HelpIcon from "@material-ui/icons/Help";
import { FormHelperText } from "@material-ui/core";
import { COLORS } from "../../../modules/styles";
import { equals } from "ramda";

import styles from "./input.module.css";

const inputStyles = {
  root: {
    height: "100%",
    "& .Mui-disabled": {
      color: COLORS.OIVA_TEXT,
      paddingLeft: 0,
      paddingRight: 0
    },
    "& label.Mui-disabled": {
      transform: "translate(0, -6px) scale(0.75)"
    },
    "& input:disabled + fieldset": {
      borderColor: "transparent !important"
    }
  },
  requiredVisited: {
    "& input + fieldset ": {
      borderColor: COLORS.OIVA_ORANGE,
      borderWidth: 2
    },
    "& label": {
      color: COLORS.OIVA_ORANGE_TEXT + " !important"
    }
  },
  readonlyNoValue: {
    "& label.Mui-disabled": {
      transform: "translate(0, -6px) scale(1)"
    }
  }
};

const Input = React.memo(
  props => {
    const [isVisited, setIsVisited] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const { classes } = props;

    const updateValue = e => {
      props.onChanges(props.payload, { value: e.target.value });
    };
    console.info(props.value);
    return (
      <React.Fragment>
        <div className="flex items-center">
          <TextField
            id={props.id}
            aria-label={props.ariaLabel}
            value={props.value}
            label={props.label}
            disabled={props.isDisabled || props.isReadOnly}
            inputprops={{
              readOnly: props.isReadOnly
            }}
            placeholder={props.placeholder}
            rows={props.rows}
            margin={props.isDense ? "dense" : ""}
            rowsMax={props.rowsMax}
            onChange={updateValue}
            required={props.isRequired && !props.isReadOnly}
            error={
              !props.isReadOnly && props.error
                ? props.error
                : (props.isRequired && props.value && !props.isValid) ||
                  (!props.isRequired && !props.isValid)
            }
            variant="outlined"
            style={
              props.fullWidth
                ? { border: "none" }
                : { width: props.width, border: "none" }
            }
            fullWidth={props.fullWidth}
            type={props.type}
            onBlurCapture={
              !props.value
                ? () => setIsVisited(true)
                : () => setIsVisited(false)
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`${props.isHidden ? "hidden" : ""} 
          ${
            !props.isReadOnly &&
            props.value === "" &&
            !isFocused &&
            props.isRequired &&
            (isVisited || props.showValidationErrors)
              ? classes.requiredVisited
              : classes.root
          } 
          ${props.isReadOnly && classes.readonlyNoValue}
        `}
          />
          {!props.isReadOnly && !props.disabled && !isEmpty(props.tooltip) && (
            <div className="ml-8">
              <Tooltip tooltip={props.tooltip.text} trigger="click">
                <HelpIcon
                  classes={{
                    colorPrimary: styles.tooltipBg
                  }}
                  color="primary"
                />
              </Tooltip>
            </div>
          )}
        </div>
        {props.showValidationErrors && props.requiredMessage && (
          <FormHelperText
            id="component-message-text"
            style={{
              marginTop: "0.1em",
              paddingLeft: "1.2em",
              marginBottom: "0.5em",
              color: COLORS.OIVA_ORANGE_TEXT
            }}>
            {props.value !== "" && props.requiredMessage}
          </FormHelperText>
        )}
      </React.Fragment>
    );
  },
  (cp, np) => {
    const isSameOld =
      cp.isDisabled === np.isDisabled &&
      cp.isHidden === np.isHidden &&
      cp.isReadOnly === np.isReadOnly &&
      cp.isRequired === np.isRequired &&
      cp.isVisited === np.isVisited &&
      cp.isDence === np.isDense &&
      cp.value === np.value &&
      equals(cp.payload, np.payload);
    return isSameOld;
  }
);

Input.defaultProps = {
  ariaLabel: "Text area",
  delay: 300,
  isDisabled: false,
  isHidden: false,
  isReadOnly: false,
  isRequired: false,
  isValid: true,
  payload: {},
  placeholder: "",
  rows: 1,
  rowsMax: 1,
  error: false,
  width: "20rem",
  fullWidth: true,
  tooltip: {},
  type: "text",
  isVisited: false,
  isDense: true
};

Input.propTypes = {
  ariaLabel: PropTypes.string,
  delay: PropTypes.number,
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  isHidden: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  isValid: PropTypes.bool,
  label: PropTypes.string,
  /** Is called with the payload and the value. */
  onChanges: PropTypes.func,
  /** Custom object defined by user. */
  payload: PropTypes.object,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  rowsMax: PropTypes.number,
  error: PropTypes.bool,
  tooltip: PropTypes.object,
  width: PropTypes.string,
  fullWidth: PropTypes.bool,
  type: PropTypes.string,
  isVisited: PropTypes.bool,
  isDense: PropTypes.bool,
  requiredMessage: PropTypes.string,
  showValidationErrors: PropTypes.bool,
  value: PropTypes.string
};

export default withStyles(inputStyles)(Input);
