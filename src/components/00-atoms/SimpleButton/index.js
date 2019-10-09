import React from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";

const defaultProps = {
  isReadOnly: false,
  payload: {},
  text: "[text is missing]",
  variant: "contained"
};

const SimpleButton = ({
  isReadOnly = defaultProps.isReadOnly,
  onClick,
  payload = defaultProps.payload,
  text = defaultProps.text,
  variant = defaultProps.variant
}) => {
  const handleClick = () => {
    onClick(payload);
  };

  return (
    <React.Fragment>
      {!isReadOnly ? (
        <Button onClick={handleClick} variant={variant}>
          {text}
        </Button>
      ) : null}
    </React.Fragment>
  );
};

SimpleButton.propTypes = {
  isReadOnly: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  payload: PropTypes.object,
  variant: PropTypes.string,
  text: PropTypes.string
};

export default SimpleButton;
