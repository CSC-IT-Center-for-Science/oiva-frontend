import React from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { createStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { FaPlus } from "react-icons/fa";
import ClearIcon from "@material-ui/icons/Clear";

const defaultProps = {
  forChangeObject: {},
  isReadOnly: false,
  text: "[text is missing]",
  variant: "contained",
  color: "primary",
  size: "large",
  disabled: false,
  icon: null,
  iconStyles: {},
  iconContainerStyles: {}
};

const styles = createStyles(theme => {
  return {
    root: {
      height: "3rem",
      fontWeight: "600",
      fontSize: "0.9375rem",
      borderRadius: 0,
      borderColor: "#d1d1d1",
      "&:focus": {
        outline: "0.2rem solid #d1d1d1"
      },
      "&:hover": {
        backgroundColor: theme.palette.primary.light
      }
    }
  };
});

const SimpleButton = ({
  ariaLabel,
  classes,
  color = defaultProps.color,
  disabled = defaultProps.disabled,
  forChangeObject = defaultProps.forChangeObject,
  fullAnchor,
  icon = defaultProps.icon,
  iconContainerStyles = defaultProps.iconContainerStyles,
  iconStyles = defaultProps.iconStyles,
  id,
  isReadOnly = defaultProps.isReadOnly,
  onClick,
  size = defaultProps.size,
  text = defaultProps.text,
  variant = defaultProps.variant
}) => {
  const handleClick = event => {
    if (!!onClick) {
      onClick({ forChangeObject, fullAnchor }, {}, event);
    } else {
      console.warn("SimpleButton: käsittelijä 'onClick' puuttuu", fullAnchor);
    }
  };

  return (
    <React.Fragment>
      {!isReadOnly && (
        <Button
          id={id}
          size={size}
          onClick={handleClick}
          variant={variant}
          color={color}
          disableElevation
          disableRipple
          disabled={disabled}
          aria-label={ariaLabel}
          className={classes.root}>
          {icon && (
            <span style={iconContainerStyles}>
              {icon === "FaPlus" && <FaPlus style={iconStyles} />}
              {icon === "ClearIcon" && <ClearIcon style={iconStyles} />}
            </span>
          )}
          {text}
        </Button>
      )}
    </React.Fragment>
  );
};

SimpleButton.propTypes = {
  ariaLabel: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  forChangeObject: PropTypes.object,
  fullAnchor: PropTypes.string,
  id: PropTypes.string,
  isReadOnly: PropTypes.bool,
  onClick: PropTypes.func,
  text: PropTypes.string,
  variant: PropTypes.string,
  icon: PropTypes.string,
  iconStyles: PropTypes.object,
  iconContainerStyles: PropTypes.object
};

export default withStyles(styles)(SimpleButton);
