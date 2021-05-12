import React, { useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { FaPlus } from "react-icons/fa";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";

const defaultProps = {
  forChangeObject: {},
  text: "[text is missing]",
  variant: "contained",
  color: "primary",
  size: "large",
  disabled: false,
  icon: null,
  iconStyles: {},
  iconContainerStyles: {},
  isDisabled: false,
  isHidden: false,
  isReadOnly: false,
  shouldHaveFocusAt: null
};

const SimpleButton = ({
  ariaLabel,
  color = defaultProps.color,
  forChangeObject = defaultProps.forChangeObject,
  fullAnchor,
  icon = defaultProps.icon,
  iconContainerStyles = defaultProps.iconContainerStyles,
  iconStyles = defaultProps.iconStyles,
  id,
  isDisabled = defaultProps.isDisabled,
  isHidden = defaultProps.isHidden,
  isReadOnly = defaultProps.isReadOnly,
  onClick,
  shouldHaveFocusAt = defaultProps.shouldHaveFocusAt,
  size = defaultProps.size,
  styleAsALink,
  text = defaultProps.text,
  variant = defaultProps.variant,
  buttonStyles = defaultProps.buttonStyles
}) => {
  const simpleButtonRef = useRef(null);

  const baseClasses =
    "inline-block no-underline text-white hover:text-gray-100 normal-case font-normal";

  const handleClick = event => {
    if (onClick) {
      onClick({ forChangeObject, fullAnchor }, {}, event);
    } else {
      console.warn("SimpleButton: käsittelijä 'onClick' puuttuu", fullAnchor);
    }
  };

  useEffect(() => {
    if (shouldHaveFocusAt) {
      simpleButtonRef.current.focus();
    }
  }, [shouldHaveFocusAt]);

  return (
    <React.Fragment>
      {!isReadOnly && !isHidden && (
        <Button
          style={buttonStyles}
          aria-label={ariaLabel}
          color={color}
          disabled={isDisabled}
          disableElevation
          disableRipple
          id={id}
          onClick={handleClick}
          ref={simpleButtonRef}
          size={size}
          variant={variant}>
          {icon && (
            <span style={iconContainerStyles}>
              {icon === "FaPlus" && <FaPlus style={iconStyles} />}
              {icon === "ClearIcon" && <ClearIcon style={iconStyles} />}
              {icon === "Delete" && <DeleteIcon style={iconStyles} />}
            </span>
          )}
          {styleAsALink ? <span className={baseClasses}>{text}</span> : text}
        </Button>
      )}
    </React.Fragment>
  );
};

SimpleButton.propTypes = {
  ariaLabel: PropTypes.string,
  color: PropTypes.string,
  isDisabled: PropTypes.bool,
  forChangeObject: PropTypes.object,
  fullAnchor: PropTypes.string,
  id: PropTypes.string,
  isHidden: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  onClick: PropTypes.func,
  text: PropTypes.string,
  variant: PropTypes.string,
  icon: PropTypes.string,
  iconStyles: PropTypes.object,
  iconContainerStyles: PropTypes.object,
  size: PropTypes.string,
  shouldHaveFocusAt: PropTypes.number,
  styleAsALink: PropTypes.bool,
  buttonStyles: PropTypes.object
};

export default SimpleButton;
