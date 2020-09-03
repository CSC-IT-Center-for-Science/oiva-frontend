import React, { useState, useEffect } from "react";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import PropTypes from "prop-types";
import Tooltip from "../../02-organisms/Tooltip";
import { isEmpty } from "ramda";
import HelpIcon from "@material-ui/icons/Help";
import { withStyles } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { FormHelperText } from "@material-ui/core";
import { COLORS } from "../../../modules/styles";

import styles from "./textbox.module.css";

const textboxStyles = {
  root: {
    outline: "none !important",
    border: "1px solid #C4C4C4",
    paddingLeft: "1em",
    paddingRight: "1em",
    "&:disabled": {
      borderColor: "transparent !important",
      paddingLeft: 0,
      paddingRight: 0,
      "& label": {
        margin: "2em"
      }
    }
  },
  required: {
    marginBottom: "-2px"
  },
  focused: {
    outline: "none !important",
    border: "2px solid green",
    paddingLeft: "0.95em",
    paddingRight: "0.95em",
    paddingTop: "0.45em"
  },
  requiredVisited: {
    boxShadow: "none",
    border: "2px solid",
    borderColor: COLORS.OIVA_ORANGE
  },
  readOnly: {
    boxShadow: "none",
    border: 0,
    marginTop: "-1em"
  },
  requiredVisitedFocus: {
    outline: "none !important",
    border: "2px solid green",
    paddingLeft: "0.95em",
    paddingRight: "0.95em",
    paddingTop: "0.45em"
  },
  error: {
    outlineColor: "red",
    boxShadow: "none",
    border: "1px solid red"
  },
  errorFocused: {
    outlineColor: "red",
    boxShadow: "none",
    border: "2px solid red"
  },
  cssLabel: {
    top: "1em",
    left: "-0.5em",
    position: "relative",
    "& .Mui-error": {
      color: "red"
    }
  },
  cssLabelFocused: {
    color: "green"
  },
  cssLabelRequired: {
    color: COLORS.OIVA_ORANGE_TEXT + " !important"
  },
  inputLabelShrink: {
    left: "0"
  },
  inputLabelReadonly: {
    top: "-1em",
    marginLeft: "-0.7em",
    color: COLORS.OIVA_TEXT + " !important"
  },
  inputLabelReadonlyShrink: {
    top: "0",
    marginLeft: "-1.1em"
  }
};

const TextBox = props => {
  const [isVisited, setIsVisited] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(null);
  const [handle, setHandle] = useState(null);
  const { classes } = props;

  const updateValue = e => {
    !e.target.value && !isFocused ? setIsVisited(true) : setIsVisited(false);
    setValue(e.target.value);
    if (handle) {
      clearTimeout(handle);
    }
    setHandle(
      (v => {
        return setTimeout(() => {
          props.onChanges(props.payload, { value: v });
        }, props.delay);
      })(e.target.value)
    );
  };

  useEffect(() => {
    if (props.value !== value || !value) {
      setValue(props.value || ""); // props.value might be undefined
    }
  }, [props.value]); // If value is added the component won't work.

  return (
    <React.Fragment>
      {value !== null ? (
        <React.Fragment>
          <div className="flex flex-row w-full">
            <div className="flex flex-col w-full">
              {props.title && !props.isHidden && (
                <InputLabel
                  disabled={props.isDisabled || props.isReadOnly}
                  htmlFor="props.id"
                  shrink={
                    isFocused || value || props.placeholder ? true : false
                  }
                  variant="outlined"
                  error={
                    props.isErroneous
                      ? props.isErroneous
                      : (props.isRequired && value && !props.isValid) ||
                        (!props.isRequired && !props.isValid)
                  }
                  classes={{
                    root: classes.cssLabel,
                    shrink: classes.inputLabelShrink,
                    disabled: classes.inputLabelReadonly
                  }}
                  className={`${
                    isFocused
                      ? classes.cssLabelFocused
                      : props.isRequired &&
                        ((!value && props.showValidationErrors) || isVisited)
                      ? classes.cssLabelRequired
                      : classes.cssLabel
                  } ${props.isReadOnly &&
                    value &&
                    classes.inputLabelReadonlyShrink}`}>
                  <span style={{ padding: "0 0.3em", background: "white" }}>
                    {props.title}
                    {!props.isReadOnly && props.isRequired && "*"}
                  </span>
                </InputLabel>
              )}
              <TextareaAutosize
                aria-label={props.ariaLabel}
                disabled={props.isDisabled || props.isReadOnly}
                id={props.id}
                placeholder={
                  props.isDisabled || props.isReadOnly ? "" : props.placeholder
                }
                rows={props.isReadOnly ? 1 : props.rows}
                rowsMax={props.isReadOnly ? Infinity : props.rowsMax}
                className={`${props.isHidden ? "hidden" : "rounded"} 
                    ${props.required && classes.required}
                    ${
                      !value &&
                      !isFocused &&
                      props.isRequired &&
                      (isVisited || props.showValidationErrors)
                        ? classes.requiredVisited
                        : classes.root
                    } 
                    ${
                      isFocused
                        ? props.isRequired
                          ? classes.requiredVisitedFocus
                          : classes.focused
                        : ""
                    } 
                    ${props.isReadOnly && classes.readOnly} 
                  ${
                    props.isErroneous ||
                    (!props.isValid && !props.isRequired) ||
                    (!props.isValid && value && props.isRequired)
                      ? isFocused
                        ? classes.errorFocused
                        : classes.error
                      : ""
                  } 
              w-full p-2 resize-none`}
                onChange={updateValue}
                value={value}
                inputprops={{
                  readOnly: props.isReadOnly
                }}
                onBlurCapture={() =>
                  !value ? setIsVisited(true) : setIsVisited(false)
                }
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                label={props.label}
              />
              {props.showValidationErrors && props.requiredMessage && !props.isHidden && (
                <FormHelperText
                  id="component-message-text"
                  style={{
                    paddingLeft: "0.5em",
                    marginBottom: "0.5em",
                    color: COLORS.OIVA_ORANGE_TEXT
                  }}>
                  {!value && props.requiredMessage}
                </FormHelperText>
              )}
            </div>
            {!props.isReadOnly && !isEmpty(props.tooltip) && (
              <div className="ml-8 mr-1 mt-4">
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
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

TextBox.defaultProps = {
  ariaLabel: "Text area",
  delay: 300,
  isDisabled: false,
  isHidden: false,
  payload: {},
  placeholder: "",
  isReadOnly: false,
  isRequired: false,
  isValid: true,
  rows: 2,
  rowsMax: 100,
  title: "",
  tooltip: {},
  isVisited: false
};

TextBox.propTypes = {
  ariaLabel: PropTypes.string,
  delay: PropTypes.number,
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  isHidden: PropTypes.bool,
  /** Is called with the payload and the value. */
  onChanges: PropTypes.func,
  /** Custom object defined by user. */
  payload: PropTypes.object,
  placeholder: PropTypes.string,
  isErroneous: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  isValid: PropTypes.bool,
  rows: PropTypes.number,
  rowsMax: PropTypes.number,
  title: PropTypes.string,
  tooltip: PropTypes.object,
  value: PropTypes.string,
  isVisited: PropTypes.bool,
  label: PropTypes.string,
  requiredMessage: PropTypes.string,
  showValidationErrors: PropTypes.bool
};

export default withStyles(textboxStyles)(TextBox);
