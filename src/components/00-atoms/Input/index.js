import React, { useCallback, useState } from "react";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import Tooltip from "../../02-organisms/Tooltip";
import { isEmpty } from "ramda";
import HelpIcon from "@material-ui/icons/Help";
import { FormHelperText } from "@material-ui/core";
import { COLORS } from "../../../modules/styles";

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

const Input = ({
  ariaLabel,
  classes,
  forChangeObject,
  fullAnchor,
  fullWidth,
  error,
  id,
  isDense,
  isDisabled,
  isHidden,
  isReadOnly,
  isRequired,
  isValid,
  label,
  onChanges,
  placeholder,
  requiredMessage,
  rows,
  rowsMax,
  showValidationErrors,
  tooltip,
  type,
  value,
  width
}) => {
  const [isVisited, setIsVisited] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const updateValue = useCallback(
    e => {
      onChanges(
        {
          forChangeObject,
          fullAnchor
        },
        {
          value:
            type === "number" ? parseInt(e.target.value, 10) : e.target.value
        }
      );
    },
    [forChangeObject, fullAnchor, onChanges, type]
  );

  return (
    <React.Fragment>
      <div className={`flex items-center ${isHidden ? "hidden" : ""}`}>
        <TextField
          id={id}
          aria-label={ariaLabel}
          value={value}
          label={label}
          disabled={isDisabled || isReadOnly}
          inputprops={{
            readOnly: isReadOnly
          }}
          placeholder={placeholder}
          rows={rows}
          margin={isDense ? "dense" : ""}
          rowsMax={rowsMax}
          onChange={updateValue}
          required={isRequired && !isReadOnly}
          error={
            !isReadOnly && error
              ? error
              : (isRequired && value && !isValid) || (!isRequired && !isValid)
          }
          variant="outlined"
          style={fullWidth ? { border: "none" } : { width, border: "none" }}
          fullWidth={fullWidth}
          type={type}
          onBlurCapture={
            !value ? () => setIsVisited(true) : () => setIsVisited(false)
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${isHidden ? "hidden" : ""} 
          ${
            !isReadOnly &&
            value === "" &&
            !isFocused &&
            isRequired &&
            (isVisited || showValidationErrors)
              ? classes.requiredVisited
              : classes.root
          } 
          ${isReadOnly && classes.readonlyNoValue}
        `}
        />
        {!isReadOnly && !isDisabled && !isEmpty(tooltip) && (
          <div className="ml-8">
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
      {showValidationErrors && requiredMessage && (
        <FormHelperText
          id="component-message-text"
          style={{
            marginTop: "0.1em",
            paddingLeft: "1.2em",
            marginBottom: "0.5em",
            color: COLORS.OIVA_ORANGE_TEXT
          }}>
          {value !== "" && requiredMessage}
        </FormHelperText>
      )}
    </React.Fragment>
  );
};

Input.defaultProps = {
  ariaLabel: "Text area",
  delay: 300,
  isDisabled: false,
  isHidden: false,
  isReadOnly: false,
  isRequired: false,
  isValid: true,
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
  classes: PropTypes.object,
  delay: PropTypes.number,
  forChangeObject: PropTypes.object,
  fullAnchor: PropTypes.string,
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  isHidden: PropTypes.bool,
  isPreviewModeOn: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  isValid: PropTypes.bool,
  label: PropTypes.string,
  /** Is called with the payload and the value. */
  onChanges: PropTypes.func,
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default withStyles(inputStyles)(Input);
