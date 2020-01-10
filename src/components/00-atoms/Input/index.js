import React from "react";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import _ from "lodash";
import { withStyles } from "@material-ui/core";
import Tooltip from "../../02-organisms/Tooltip";
import { isEmpty } from "ramda";
import HelpIcon from "@material-ui/icons/Help";

import styles from "./input.module.css";

const CssTextField = withStyles({
  root: {
    "& MuiInputBase-input": {
      "& .Mui-disabled": {
        color: "pink"
      }
    },
    "& label.Mui-focused": {
      color: "green"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "green"
    },
    "& .MuiInputBase-root": {
      "&.Mui-disabled": {
        color: "rgba(0, 0, 0, 0.87)"
      }
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-disabled fieldset": {
        border: "none"
      }
    }
  }
})(TextField);

const Input = props => {
  const changesOutDelayed = _.debounce(props.onChanges, props.delay);

  return (
    <div className="flex items-center">
      <CssTextField
        id={props.id}
        aria-label={props.ariaLabel}
        defaultValue={props.value}
        label={props.label}
        disabled={props.isDisabled || props.isReadOnly}
        inputprops={{
          readOnly: props.isReadOnly
        }}
        placeholder={
          props.isDisabled || props.isReadOnly ? "" : props.placeholder
        }
        rows={props.rows}
        margin="dense"
        rowsMax={props.rowsMax}
        className={`
        ${props.isHidden ? "hidden" : ""}
        ${props.isReadOnly ? "text-black border-collapse" : ""} p-2`}
        onChange={e =>
          changesOutDelayed(props.payload, { value: e.target.value })
        }
        error={props.error}
        InputLabelProps={props.isReadOnly ? { shrink: true } : {}}
        variant="outlined"
        style={
          props.fullWidth
            ? { border: "none" }
            : { width: props.width, border: "none" }
        }
        fullWidth={props.fullWidth}
        type={props.type}
      />
      {!isEmpty(props.tooltip) && (
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
  );
};

Input.defaultProps = {
  ariaLabel: "Text area",
  delay: 300,
  isDisabled: false,
  isHidden: false,
  isReadOnly: false,
  payload: {},
  placeholder: "",
  rows: 1,
  rowsMax: 1,
  error: false,
  width: "20em",
  fullWidth: false,
  tooltip: {},
  type: "text"
};

Input.propTypes = {
  ariaLabel: PropTypes.string,
  delay: PropTypes.number,
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  isHidden: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  label: PropTypes.string,
  /** Is called with the payload and the value. */
  onChanges: PropTypes.func.isRequired,
  /** Custom object defined by user. */
  payload: PropTypes.object,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  rowsMax: PropTypes.number,
  error: PropTypes.bool,
  tooltip: PropTypes.object,
  width: PropTypes.string,
  fullWidth: PropTypes.bool,
  type: PropTypes.string
};

export default Input;
