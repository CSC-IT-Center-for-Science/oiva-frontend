import React from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { createStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const defaultProps = {
  isReadOnly: false,
  payload: {},
  text: "[text is missing]",
  variant: "contained",
  color: "primary",
  size: "large",
  disabled: false
};

const styles = createStyles(theme => ({
  root: {
    height: "3rem",
    fontWeight: "600",
    fontSize: "0.9375rem",
    borderRadius: 0,
    borderColor: "#d1d1d1",
    "&:focus": {
      outline: "0.2rem solid #d1d1d1"
    }
  }
}));

const SimpleButton = ({
  isReadOnly = defaultProps.isReadOnly,
  onClick,
  payload = defaultProps.payload,
  text = defaultProps.text,
  variant = defaultProps.variant,
  color = defaultProps.color,
  ariaLabel,
  size = defaultProps.size,
  classes,
  disabled = defaultProps.disabled
}) => {
  const handleClick = event => {
    onClick(payload, {}, event);
  };

  return (
    <React.Fragment>
      {!isReadOnly && (
        <Button
          size={size}
          onClick={handleClick}
          variant={variant}
          color={color}
          disableElevation
          disableRipple
          disabled={disabled}
          aria-label={ariaLabel}
          className={classes.root}>
          {text}
        </Button>
      )}
    </React.Fragment>
  );
};

SimpleButton.propTypes = {
  isReadOnly: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  payload: PropTypes.object,
  variant: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
  ariaLabel: PropTypes.string
};

export default withStyles(styles)(SimpleButton);
