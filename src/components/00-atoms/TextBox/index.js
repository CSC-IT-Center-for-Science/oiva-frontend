import React, { useCallback, useEffect, useRef, useState } from "react";
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
import SimpleButton from "../SimpleButton";

// Komponentin teksti lähetetään komponentin ulkopuolelle
// tässä määritellyn ajan (ms) kuluttua.
const sendOutDelay = 500;

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

const TextBox = ({
  ariaLabel,
  classes,
  forChangeObject,
  fullAnchor,
  id,
  isDisabled,
  isErroneous,
  isHidden,
  isPreviewModeOn,
  isReadOnly,
  isRemovable,
  isRequired,
  isValid,
  label,
  onChanges,
  placeholder,
  requiredMessage,
  rows,
  rowsMax,
  showValidationErrors,
  shouldHaveFocusAt,
  title,
  tooltip,
  value
}) => {
  const [isVisited, setIsVisited] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [sendOutHandle, setSendOutHandle] = useState();
  const [internalValue, setInternalValue] = useState();
  const [isOkToSendOut, setIsOkToSendOut] = useState(false);

  const textBoxRef = useRef(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (isOkToSendOut) {
      onChanges(
        {
          forChangeObject,
          fullAnchor
        },
        {
          value: internalValue
        }
      );
      setIsOkToSendOut(false);
    }
  }, [forChangeObject, fullAnchor, internalValue, isOkToSendOut, onChanges]);

  const updateValue = useCallback(
    e => {
      setInternalValue(e.target.value);

      if (sendOutHandle) {
        clearTimeout(sendOutHandle);
      }

      const handle = setTimeout(() => {
        setIsOkToSendOut(true);
      }, sendOutDelay);

      setSendOutHandle(handle);
    },
    [sendOutHandle]
  );

  const deleteTextBox = useCallback(() => {
    onChanges(
      {
        forChangeObject,
        fullAnchor
      },
      {
        isDeleted: true,
        dateOfRemoval: new Date().getTime()
      }
    );
  }, [forChangeObject, fullAnchor, onChanges]);

  useEffect(() => {
    if (shouldHaveFocusAt) {
      textBoxRef.current.focus();
    }
  }, [shouldHaveFocusAt]);

  return (
    <React.Fragment>
      {value !== null ? (
        <React.Fragment>
          <div className="flex flex-row w-full">
            <div className="flex flex-col w-full">
              {title && !isHidden && (
                <InputLabel
                  disabled={isDisabled || isReadOnly}
                  htmlFor={id}
                  shrink={isFocused || value || placeholder ? true : false}
                  variant="outlined"
                  error={
                    isErroneous
                      ? isErroneous
                      : (isRequired && value && !isValid) ||
                        (!isRequired && !isValid)
                  }
                  classes={{
                    root: classes.cssLabel,
                    shrink: classes.inputLabelShrink,
                    disabled: classes.inputLabelReadonly
                  }}
                  className={`${
                    isFocused
                      ? classes.cssLabelFocused
                      : isRequired &&
                        ((!value && showValidationErrors) || isVisited)
                      ? classes.cssLabelRequired
                      : classes.cssLabel
                  } ${
                    isReadOnly && value && classes.inputLabelReadonlyShrink
                  }`}>
                  <span style={{ padding: "0 0.3em", background: "white" }}>
                    {title}
                    {!isReadOnly && isRequired && "*"}
                  </span>
                </InputLabel>
              )}
              <TextareaAutosize
                aria-label={ariaLabel}
                disabled={isDisabled || isReadOnly}
                id={id}
                placeholder={isDisabled || isReadOnly ? "" : placeholder}
                ref={textBoxRef}
                rows={isReadOnly ? 1 : rows}
                rowsMax={isReadOnly ? Infinity : rowsMax}
                className={`${isHidden ? "hidden" : "rounded"} 
                    ${isRequired && classes.required}
                    ${
                      !value &&
                      !isFocused &&
                      isRequired &&
                      (isVisited || showValidationErrors)
                        ? classes.requiredVisited
                        : classes.root
                    } 
                    ${
                      isFocused
                        ? isRequired
                          ? classes.requiredVisitedFocus
                          : classes.focused
                        : ""
                    } 
                    ${isReadOnly && classes.readOnly} 
                  ${
                    isErroneous ||
                    (!isValid && !isRequired) ||
                    (!isValid && value && isRequired)
                      ? isFocused
                        ? classes.errorFocused
                        : classes.error
                      : ""
                  } 
              w-full p-2 resize-none ${isPreviewModeOn ? "bg-white" : ""}`}
                onChange={updateValue}
                value={internalValue}
                inputprops={{
                  readOnly: isReadOnly
                }}
                onBlurCapture={() =>
                  !value ? setIsVisited(true) : setIsVisited(false)
                }
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                label={label}
              />
              {showValidationErrors && requiredMessage && !isHidden && (
                <FormHelperText
                  id="component-message-text"
                  style={{
                    paddingLeft: "0.5em",
                    marginBottom: "0.5em",
                    color: COLORS.OIVA_ORANGE_TEXT
                  }}>
                  {!value && requiredMessage}
                </FormHelperText>
              )}
            </div>
            {!isReadOnly && isRemovable && !isHidden && (
              <div
                className="ml-8 mr-1 mt-4"
                style={{ position: "relative", right: "32px", top: "7px" }}>
                <SimpleButton
                  ariaLabel={"Remove text area"}
                  icon={"ClearIcon"}
                  color={"default"}
                  variant={"text"}
                  text={""}
                  onClick={deleteTextBox}
                />
              </div>
            )}
            {!isReadOnly && !isEmpty(tooltip) && (
              <div className="ml-8 mr-1 mt-4">
                <Tooltip tooltip={tooltip.text} trigger="click">
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
  isReadOnly: false,
  isRemovable: false,
  isRequired: false,
  isValid: true,
  isVisited: false,
  placeholder: "",
  rows: 2,
  rowsMax: 100,
  title: "",
  tooltip: {},
  value: ""
};

TextBox.propTypes = {
  ariaLabel: PropTypes.string,
  classes: PropTypes.object,
  delay: PropTypes.number,
  forChangeObject: PropTypes.object,
  fullAnchor: PropTypes.string,
  id: PropTypes.string,
  isDeleted: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isErroneous: PropTypes.bool,
  isHidden: PropTypes.bool,
  isPreviewModeOn: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRemovable: PropTypes.bool,
  isRequired: PropTypes.bool,
  isValid: PropTypes.bool,
  isVisited: PropTypes.bool,
  label: PropTypes.string,
  /** Is called with the payload and the value. */
  onChanges: PropTypes.func,
  placeholder: PropTypes.string,
  requiredMessage: PropTypes.string,
  rows: PropTypes.number,
  rowsMax: PropTypes.number,
  shouldHaveFocusAt: PropTypes.number,
  showValidationErrors: PropTypes.bool,
  title: PropTypes.string,
  tooltip: PropTypes.object,
  value: PropTypes.string
};

export default withStyles(textboxStyles)(TextBox);
