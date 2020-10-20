import React, { useState } from "react";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import { COLORS } from "../../../modules/styles";
import { FormHelperText, InputLabel } from "@material-ui/core";

import "./dropdown.css";

import { withStyles } from "@material-ui/core";
import { addIndex, map } from "ramda";

const selectCustomStyles = {
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

const Dropdown = props => {
  const [isVisited, setIsVisited] = useState(false);
  const [, setIsFocused] = useState(false);

  const handleChanges = e => {
    props.onChanges(props.payload, { selectedOption: e.target.value });
  };

  return (
    <React.Fragment>
      <FormControl
        variant="outlined"
        disabled={props.isDisabled}
        required={props.isRequired}
        error={props.error}
        fullWidth={props.fullWidth}
        margin="dense">
        {props.label && (
          <InputLabel id="select-label">{props.label}</InputLabel>
        )}
        <Select
          labelId="select-label"
          aria-label={props.label}
          value={props.value}
          onChange={handleChanges}
          onBlurCapture={
            !props.value ? () => setIsVisited(true) : () => setIsVisited(false)
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={props.placeholder}>
          {addIndex(map)((item, i) => {
            return item ? (
              <MenuItem key={i} value={item.value}>
                {item.label}
              </MenuItem>
            ) : null;
          }, props.options).filter(Boolean)}
        </Select>
      </FormControl>
      {props.showValidationErrors && props.requiredMessage && (
        <FormHelperText
          id="component-message-text"
          style={{
            marginTop: "0.1em",
            paddingLeft: "1.2em",
            marginBottom: "0.5em",
            color: COLORS.OIVA_ORANGE_TEXT
          }}>
          {isVisited && !props.value && props.requiredMessage}
        </FormHelperText>
      )}
    </React.Fragment>
  );
};

Dropdown.defaultProps = {
  value: ""
};

Dropdown.propTypes = {
  isDisabled: PropTypes.bool,
  onChanges: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  fullWidth: PropTypes.bool,
  isRequired: PropTypes.bool,
  requiredMessage: PropTypes.string,
  showValidationErrors: PropTypes.bool,
  label: PropTypes.string,
  error: PropTypes.bool,
  emptyMessage: PropTypes.string
};

export default withStyles(selectCustomStyles)(Dropdown);
