import React from "react";
import PropTypes from "prop-types";

const RadioButton = props => {
  return (
    <input
      type="radio"
      name={props.name}
      checked={props.isChecked}
      onChange={props.onChanges}
    />
  );
};

RadioButton.propTypes = {
  name: PropTypes.string,
  isChecked: PropTypes.bool,
  onChanges: PropTypes.func
};

export default RadioButton;
