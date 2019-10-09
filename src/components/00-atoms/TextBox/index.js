import React, { useState, useEffect } from "react";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import PropTypes from "prop-types";

const TextBox = props => {
  const [value, setValue] = useState(null);
  const [handle, setHandle] = useState(null);

  const updateValue = e => {
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
      setValue(props.value);
    }
  }, [props.value]);

  return (
    <React.Fragment>
      {value !== null ? (
        <React.Fragment>
          {props.title && <label className="text-bold text-base block my-2">{props.title}</label>}
          <TextareaAutosize
            aria-label={props.ariaLabel}
            disabled={props.isDisabled || props.isReadOnly}
            placeholder={props.placeholder}
            rows={props.rows}
            rowsMax={props.rowsMax}
            className={`${props.isHidden ? "hidden" : ""} ${
              props.isReadOnly ? "" : "border border-solid"
            } w-full p-2`}
            onChange={updateValue}
            value={value}
          />
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
  rows: 3,
  rowsMax: 100,
  title: ""
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
  isReadOnly: PropTypes.bool,
  rows: PropTypes.number,
  rowsMax: PropTypes.number,
  title: PropTypes.string,
  value: PropTypes.string
};

export default TextBox;
