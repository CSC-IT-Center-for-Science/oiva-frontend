import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import * as R from "ramda";

const defaultValues = {
  applyForValue: 0,
  delay: 300,
  initialValue: 100,
  titles: ["[Title 1]", "[Title 2]", "[Title 3]"],
  isReadOnly: false,
  isRequired: false
};

const emptySelectionPlaceholderValue = "";

function isValueValid(isRequired, value) {
  let isValid = true;
  if (isRequired === true) {
    isValid = !(value === emptySelectionPlaceholderValue) && value >= 0;
  }
  if (value < 0) {
    isValid = false;
  }
  return isValid;
}

const Difference = ({
  applyForValue = defaultValues.applyForValue,
  delay = defaultValues.delay,
  initialValue = defaultValues.initialValue,
  onChanges,
  payload = {},
  titles = defaultValues.titles,
  isReadOnly = defaultValues.isReadOnly,
  isRequired = defaultValues.isRequired
}) => {
  const [timeoutHandle, setTimeoutHandle] = useState(null);
  const [value, setValue] = useState(initialValue);
  const required = R.path(["component","properties","isRequired"],payload) || isRequired;
  const readonly = R.path(["component","properties","isReadOnly"],payload) || isReadOnly;

  const isValid = isValueValid(required, value)

  const handleChange = useCallback(
    (actionResults, payload) => {
      const resultIsNaN = isNaN(actionResults.value);
      const result = resultIsNaN ? emptySelectionPlaceholderValue : actionResults.value;

      const resultIsValid = isValueValid(required, result);

      setValue(result);
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      setTimeoutHandle(
        setTimeout(() => {
          onChanges(payload, {
            applyForValue: resultIsNaN ? initialValue : actionResults.value,
            isValid: resultIsValid
          });
        }, delay)
      );
    },
    [delay, initialValue, onChanges, timeoutHandle, required]
  );

  useEffect(() => {
    setValue(applyForValue === initialValue ? emptySelectionPlaceholderValue : applyForValue);
  }, [applyForValue, initialValue]);

  const containerClass = isValid ? "flex" : "flex bg-yellow-300";

  const initialAreaTitle = titles[0];
  const inputAreaTitle = required ? titles[1]+'*' : titles[1];
  const changeAreaTitle = titles[2];

  return (
    <React.Fragment>
      <div className={containerClass}>
        <div className="flex-1 flex-col">
          <Typography>{initialAreaTitle}</Typography>
          {initialValue}
        </div>
        <div className="flex-1 flex-col">
          <Typography>{inputAreaTitle}</Typography>
          {!readonly &&
            <TextField
              type="number"
              inputProps={{ min: "0" }}
              onChange={e =>
                handleChange({value: parseInt(e.target.value, 10)}, payload)
              }
              value={value}
            />
          }
          {readonly && applyForValue}
        </div>
        <div className="flex-1 flex-col">
          <Typography>{changeAreaTitle}</Typography>
          {(value ? value : applyForValue) - initialValue}
        </div>
      </div>
    </React.Fragment>
  );
};

Difference.propTypes = {
  applyForValue: PropTypes.number,
  delay: PropTypes.number,
  initialValue: PropTypes.number,
  onChanges: PropTypes.func.isRequired,
  titles: PropTypes.array,
  isReadOnly: PropTypes.bool,
  isRequired: PropTypes.bool
};

export default Difference;
