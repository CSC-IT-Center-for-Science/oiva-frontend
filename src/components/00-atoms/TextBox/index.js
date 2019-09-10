import React, { useEffect } from "react";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import PropTypes from "prop-types";
import _ from "lodash";

const TextBox = props => {
  const changesOutDelayed = _.debounce(props.onChanges, props.delay);

  return (
    <React.Fragment>
      {props.value !== null ? (
        <TextareaAutosize
          aria-label={props.ariaLabel}
          disabled={props.isDisabled}
          placeholder={props.placeholder}
          rows={props.rows}
          rowsMax={props.rowsMax}
          className={`${
            props.isHidden ? "hidden" : ""
          } w-full border border-solid p-2`}
          onChange={e =>
            changesOutDelayed(props.payload, { value: e.target.value })
          }
          value={props.value}
        />
      ) : null}
    </React.Fragment>
  );
};

TextBox.defaultProps = {
  ariaLabel: "Text area",
  delay: 0,
  isDisabled: false,
  isHidden: false,
  payload: {},
  placeholder: "",
  rows: 3,
  rowsMax: 100
};

TextBox.propTypes = {
  ariaLabel: PropTypes.string,
  delay: PropTypes.number,
  isDisabled: PropTypes.bool,
  isHidden: PropTypes.bool,
  /** Is called with the payload and the value. */
  onChanges: PropTypes.func.isRequired,
  /** Custom object defined by user. */
  payload: PropTypes.object,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  rowsMax: PropTypes.number,
  value: PropTypes.string
};

export default TextBox;
